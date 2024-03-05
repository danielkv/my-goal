import dayjs from 'dayjs'
import { APP_ENTITLEMENTS } from 'goal-models'
import { APP_ENTITLEMENT_DESCRIPTIONS, FREE_ENTITLEMENTS, getCurrentSubscription } from 'goal-utils'
import { RiBusinessPassExpiredFill } from 'solid-icons/ri'

import { Component, For, Show, createMemo, createResource, createSignal } from 'solid-js'

import ActivityIndicator from '@components/ActivityIndicator'
import DashboardContainer from '@components/DashboardContainer'
import ManageSubscription from '@components/ManageSubscription'
import { loggedUser } from '@contexts/user/user.context'
import { useParams } from '@solidjs/router'
import { AdminPanelSettings, Close, Engineering, Loyalty, MarkEmailRead, Paid } from '@suid/icons-material'
import {
    Box,
    Button,
    CircularProgress,
    Container,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@suid/material'
import { expireUserProgramUseCase } from '@useCases/programs/expireUserProgram'
import { listUserPrograms } from '@useCases/programs/listUserPrograms'
import { revokePromotionalEntitlementUseCase } from '@useCases/subscriptions/revokePromtionalEntitlement'
import { getUserDetailsUseCase } from '@useCases/user/getUserDetails'
import { getErrorMessage } from '@utils/errors'
import { redirectToLogin } from '@utils/redirectToLogin'

import AddUserProgramForm from './components/AddUserProgramForm'

const UserDetailsScreen: Component = () => {
    redirectToLogin()

    const params = useParams<{ id: string }>()
    const [manageSubscriptionOpen, setManageSubscriptionOpen] = createSignal(false)
    const [userProgramDialog, setUserProgramDialog] = createSignal(false)
    const [loading, setLoading] = createSignal(false)
    const [loadingAction, setLoadingAction] = createSignal<string | null>(null)

    const [userDetails, { refetch }] = createResource(() => params.id || null, getUserDetailsUseCase)
    const [userPrograms, { refetch: refetchUserPrograms }] = createResource(() => params.id || null, listUserPrograms)

    const entitlements = createMemo(() => {
        const ents = userDetails()?.entitlements
        if (!ents) return []

        return Object.entries(ents)
    })

    const currentSubscription = createMemo(() => {
        const ents = userDetails()?.entitlements
        if (!ents) return 'none'

        return getCurrentSubscription(ents)
    })

    const handleDeletePromotionalEntitlement = async (id: APP_ENTITLEMENTS) => {
        if (!confirm('Tem certeza que deseja revogar esse tipo de acesso do usuário?')) return

        try {
            const app_user_id = userDetails()?.email
            if (!app_user_id) return alert('app_user_id is empty')

            setLoading(true)
            await revokePromotionalEntitlementUseCase(app_user_id, id)
            await refetch()
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    const handleExpireUseProgram = async (id: string) => {
        if (!confirm('Tem certeza que deseja expirar o acesso do usuário à esse programa?')) return

        try {
            setLoadingAction(id)
            await expireUserProgramUseCase(id)
            await refetchUserPrograms()
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setLoadingAction(null)
        }
    }

    return (
        <DashboardContainer>
            <ManageSubscription
                open={manageSubscriptionOpen()}
                onClose={() => setManageSubscriptionOpen(false)}
                onSuccess={async () => {
                    await refetch()
                }}
                current={currentSubscription()}
                app_user_id={userDetails()?.email || ''}
            />
            <Show when={userDetails()}>
                {(user) => (
                    <AddUserProgramForm
                        open={userProgramDialog()}
                        onClose={() => setUserProgramDialog(false)}
                        onSuccess={async () => {
                            await refetchUserPrograms()
                        }}
                        userId={user().id}
                    />
                )}
            </Show>
            <Container maxWidth="lg">
                <Box mt={6}>
                    <Box>
                        <Stack>
                            <Stack direction="row" mb={8} alignItems="center" justifyContent="space-between">
                                <Stack direction="row" alignItems="center" gap={3}>
                                    {(userDetails.loading || loading()) && (
                                        <ActivityIndicator size={30} color="white" />
                                    )}
                                    <Typography variant="h1" fontSize={28} fontWeight="bold">
                                        {userDetails()?.displayName} ({userDetails()?.email})
                                    </Typography>
                                    <Show when={userDetails()?.id === loggedUser()?.id}>
                                        <Box>(você)</Box>
                                    </Show>
                                    <Show when={userDetails()?.admin}>
                                        <div title="Admin">
                                            <AdminPanelSettings color="info" fontSize="small" />
                                        </div>
                                    </Show>
                                    <Show when={userDetails()?.emailVerified}>
                                        <div title="Email verificado">
                                            <MarkEmailRead color="success" fontSize="small" />
                                        </div>
                                    </Show>
                                </Stack>
                                <Stack direction="row" alignItems="center" gap={3}>
                                    <Button
                                        disabled={loading()}
                                        variant="contained"
                                        onClick={() => setManageSubscriptionOpen(true)}
                                    >
                                        Editar Assinatura
                                    </Button>
                                    <Button onClick={() => setUserProgramDialog(true)} variant="contained">
                                        Novo programa
                                    </Button>
                                </Stack>
                            </Stack>
                            <Show when={userDetails()?.phone}>
                                <Typography>{userDetails()?.phone}</Typography>
                            </Show>
                        </Stack>
                        <Stack gap={2}>
                            <For each={entitlements()}>
                                {([key, entitlement]) => {
                                    const isFree = FREE_ENTITLEMENTS.map((e) => e.identifier).includes(key)
                                    const subscription = userDetails()?.subscriptions[entitlement.product_identifier]

                                    const isPromotional = subscription?.store === 'promotional'
                                    const isSandbox = !!subscription?.is_sandbox

                                    return (
                                        <Box backgroundColor="#111" borderRadius={3} padding={2} position="relative">
                                            <Stack direction="row" position="absolute" alignItems="center" right={20}>
                                                {isPromotional ? (
                                                    <>
                                                        <IconButton
                                                            disabled={loading()}
                                                            onClick={() =>
                                                                handleDeletePromotionalEntitlement(
                                                                    key as APP_ENTITLEMENTS
                                                                )
                                                            }
                                                        >
                                                            <Close />
                                                        </IconButton>
                                                        <div title="Promocional">
                                                            <Loyalty />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div title="Pago (não é promocional)">
                                                        <Paid />
                                                    </div>
                                                )}
                                                {isSandbox && (
                                                    <div title="Sandbox (ambiente de testes)">
                                                        <Engineering />
                                                    </div>
                                                )}
                                            </Stack>
                                            <Stack gap={1} flex={1}>
                                                <Stack direction="row" gap={3}>
                                                    <Typography fontSize={14} fontWeight="700">
                                                        {APP_ENTITLEMENT_DESCRIPTIONS[key as APP_ENTITLEMENTS]}
                                                    </Typography>
                                                </Stack>
                                                {!isFree && (
                                                    <>
                                                        <Stack direction="row" gap={1}>
                                                            <Typography fontSize={12} color="$gray3">
                                                                Última renovação:
                                                            </Typography>
                                                            <Typography fontSize={12}>
                                                                {dayjs(entitlement.purchase_date).format(
                                                                    'DD/MM/YYYY HH:mm'
                                                                )}
                                                            </Typography>
                                                        </Stack>
                                                        <Stack direction="row" gap={1}>
                                                            <Typography fontSize={12} color="$gray3">
                                                                Expira em:
                                                            </Typography>
                                                            <Typography fontSize={12}>
                                                                {dayjs(entitlement.expires_date).format(
                                                                    'DD/MM/YYYY HH:mm'
                                                                )}
                                                            </Typography>
                                                        </Stack>
                                                    </>
                                                )}
                                            </Stack>
                                        </Box>
                                    )
                                }}
                            </For>
                        </Stack>
                        <Stack mt={4}>
                            <Typography fontWeight="bold" variant="h5" mb={3}>
                                Programas
                            </Typography>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Data da compra</TableCell>
                                        <TableCell>Nome</TableCell>
                                        <TableCell>Valor Pago</TableCell>
                                        <TableCell>Expira em</TableCell>
                                        <TableCell>Ações</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <For each={userPrograms()}>
                                        {(userProgram) => {
                                            const expired = createMemo(() => dayjs().isAfter(userProgram.expires_at))
                                            return (
                                                <TableRow>
                                                    <TableCell>
                                                        {dayjs(userProgram.created_at).format('DD/MM/YYYY HH:mm')}
                                                    </TableCell>
                                                    <TableCell>{userProgram.program?.name}</TableCell>
                                                    <TableCell>
                                                        {Intl.NumberFormat('pt-br', {
                                                            style: 'currency',
                                                            currency: 'BRL',
                                                        }).format(userProgram.paid_amount)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {dayjs(userProgram.expires_at).format('DD/MM/YYYY HH:mm')}
                                                    </TableCell>

                                                    <TableCell>
                                                        <Show when={loadingAction() === userProgram.id}>
                                                            <CircularProgress size={20} color="warning" />
                                                        </Show>
                                                        <Show
                                                            when={
                                                                !loadingAction() || loadingAction() !== userProgram.id
                                                            }
                                                        >
                                                            <IconButton
                                                                title="Expirar agora"
                                                                onClick={() => handleExpireUseProgram(userProgram.id)}
                                                                disabled={expired()}
                                                            >
                                                                <RiBusinessPassExpiredFill />
                                                            </IconButton>
                                                        </Show>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }}
                                    </For>
                                </TableBody>
                            </Table>
                        </Stack>
                    </Box>
                </Box>
            </Container>
        </DashboardContainer>
    )
}

export default UserDetailsScreen

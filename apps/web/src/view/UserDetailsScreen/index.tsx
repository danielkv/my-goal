import dayjs from 'dayjs'
import { APP_ENTITLEMENTS } from 'goal-models'
import { APP_ENTITLEMENT_DESCRIPTIONS, FREE_ENTITLEMENTS, getCurrentSubscription } from 'goal-utils'

import { Component, For, Show, createMemo, createResource, createSignal } from 'solid-js'

import ActivityIndicator from '@components/ActivityIndicator'
import DashboardContainer from '@components/DashboardContainer'
import ManageSubscription from '@components/ManageSubscription'
import { loggedUser } from '@contexts/user/user.context'
import { useParams } from '@solidjs/router'
import { AdminPanelSettings, Close, Engineering, Loyalty, MarkEmailRead, Paid } from '@suid/icons-material'
import { Box, Button, Container, IconButton, Stack, Typography } from '@suid/material'
import { revokePromotionalEntitlementUseCase } from '@useCases/subscriptions/revokePromtionalEntitlement'
import { getUserDetailsUseCase } from '@useCases/user/getUserDetails'
import { getErrorMessage } from '@utils/errors'
import { redirectToLogin } from '@utils/redirectToLogin'

const UserDetailsScreen: Component = () => {
    redirectToLogin()

    const params = useParams<{ id: string }>()
    const [manageSubscriptionOpen, setManageSubscriptionOpen] = createSignal(false)
    const [loading, setLoading] = createSignal(false)

    const [userDetails, { refetch }] = createResource(() => params.id || null, getUserDetailsUseCase)

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
                                <Stack direction="row" alignItems="center">
                                    <Button
                                        disabled={loading()}
                                        variant="contained"
                                        onClick={() => setManageSubscriptionOpen(true)}
                                    >
                                        Editar Assinatura
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
                    </Box>
                </Box>
            </Container>
        </DashboardContainer>
    )
}

export default UserDetailsScreen

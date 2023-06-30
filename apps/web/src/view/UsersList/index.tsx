import cloneDeep from 'clone-deep'

import { Component, For, Show, createMemo, createResource, createSignal } from 'solid-js'

import Pagination from '@components/Pagination'
import { loggedUser } from '@contexts/user/user.context'
import {
    AdminPanelSettings,
    Delete,
    MarkEmailRead,
    PersonAdd,
    PersonRemove,
    ToggleOff,
    ToggleOn,
} from '@suid/icons-material'
import {
    Box,
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
import { getUsersUseCase } from '@useCases/user/getUsers'
import { removeUserUseCase } from '@useCases/user/removeUser'
import { toggleAdminAccessUseCase } from '@useCases/user/toggleAdminAccess'
import { toggleEnableUserUseCase } from '@useCases/user/toggleEnableUser'
import { getErrorMessage } from '@utils/errors'
import { redirectToLogin } from '@utils/redirectToLogin'

const UsersList: Component = () => {
    redirectToLogin()

    const [loadinAction, setLoadingAction] = createSignal<string | null>(null)
    const [pageTokens, setPageTokens] = createSignal<string[]>([])

    const currentPageToken = createMemo(() => pageTokens().at(-1) || undefined)

    const [listResult, { refetch }] = createResource(
        () => ({ limit: 25, pageToken: currentPageToken() }),
        getUsersUseCase
    )

    const handleToggleAdminAccess = async (uid: string, current: boolean) => {
        if (current) {
            if (!confirm('Tem certeza que deseja remover o a função ADM desse usuário?')) return
        } else {
            if (!confirm('Tem certeza que deseja tornar esse usuário um ADM?')) return
        }

        try {
            setLoadingAction(uid)
            await toggleAdminAccessUseCase(uid)
            await refetch()
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setLoadingAction(null)
        }
    }

    const handleToggleEnableUser = async (uid: string, current: boolean) => {
        if (current) {
            if (!confirm('Tem certeza que deseja ativar esse?')) return
        } else {
            if (!confirm('Tem certeza que deseja desativar esse usuário?')) return
        }
        try {
            setLoadingAction(uid)
            await toggleEnableUserUseCase(uid)

            await refetch()
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setLoadingAction(null)
        }
    }

    const handleRemoveUser = async (uid: string) => {
        if (!confirm('Tem certeza que deseja desativar excluir esse usuário?')) return

        try {
            setLoadingAction(uid)
            await removeUserUseCase(uid)
            await refetch()
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setLoadingAction(null)
        }
    }

    const handleNextPage = () => {
        const restultToken = listResult()?.pageToken
        if (!restultToken) return
        setPageTokens((curr) => [...curr, restultToken])
    }

    const handlePrevPage = () => {
        const curPageTokens = pageTokens()
        if (curPageTokens.length < 1) return
        curPageTokens.splice(curPageTokens.length - 1, 1)
        setPageTokens(cloneDeep(curPageTokens))
    }

    return (
        <Container maxWidth="lg">
            <Box mt={6}>
                <Typography variant="h1" fontSize={28} mb={8} fontWeight="bold">
                    Lista de usuários{' '}
                    <Show when={listResult.loading}>
                        <CircularProgress size={20} color="warning" />
                    </Show>
                </Typography>

                <Show when={listResult()?.users.length}>
                    <Pagination onClickNext={handleNextPage} onClickPrev={handlePrevPage} />
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Telefone</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <For each={listResult()?.users}>
                                {(user) => (
                                    <TableRow>
                                        <TableCell>
                                            <Stack direction="row" spacing={1}>
                                                <Box fontWeight="bold">{user.displayName}</Box>
                                                <Show when={user.uid === loggedUser()?.uid}>
                                                    <Box>(você)</Box>
                                                </Show>
                                                <Show when={user.customClaims?.admin}>
                                                    <div title="Admin">
                                                        <AdminPanelSettings color="info" fontSize="small" />
                                                    </div>
                                                </Show>
                                                <Show when={user.emailVerified}>
                                                    <div title="Email verificado">
                                                        <MarkEmailRead color="success" fontSize="small" />
                                                    </div>
                                                </Show>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phoneNumber}</TableCell>
                                        <TableCell>
                                            <Show when={loadinAction() === user.uid}>
                                                <CircularProgress size={20} color="warning" />
                                            </Show>
                                            <Show when={!loadinAction() || loadinAction() !== user.uid}>
                                                <IconButton
                                                    title={user.disabled ? 'Ativar usuário' : 'Inativar usuário'}
                                                    onClick={() => handleToggleEnableUser(user.uid, user.disabled)}
                                                    disabled={user.uid === loggedUser()?.uid}
                                                    color={user.disabled ? 'error' : 'success'}
                                                >
                                                    {user.disabled ? <ToggleOn /> : <ToggleOff />}
                                                </IconButton>
                                                <IconButton
                                                    title={user.disabled ? 'Remover função ADM' : 'Tornar ADM'}
                                                    onClick={() =>
                                                        handleToggleAdminAccess(user.uid, !!user.customClaims?.admin)
                                                    }
                                                    disabled={user.uid === loggedUser()?.uid}
                                                >
                                                    {user.customClaims?.admin ? <PersonRemove /> : <PersonAdd />}
                                                </IconButton>
                                                <IconButton
                                                    title="Excluir usuário"
                                                    onClick={() => handleRemoveUser(user.uid)}
                                                    disabled={user.uid === loggedUser()?.uid}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Show>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </For>
                        </TableBody>
                    </Table>
                    <Pagination onClickNext={handleNextPage} onClickPrev={handlePrevPage} />
                </Show>
            </Box>
        </Container>
    )
}

export default UsersList

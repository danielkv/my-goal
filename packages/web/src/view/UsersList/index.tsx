import { Component, For, Show, createEffect, createResource, createSignal } from 'solid-js'

import { loggedUser } from '@contexts/user/user.context'
import { AdminPanelSettings, Delete, Person, PersonAdd, PersonOff, PersonRemove } from '@suid/icons-material'
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

    const [listResult, { refetch }] = createResource(() => ({ limit: 100 }), getUsersUseCase)

    createEffect(() => {
        listResult()
    })

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
            if (!confirm('Tem certeza que deseja desativar esse usuário?')) return
        } else {
            if (!confirm('Tem certeza que deseja ativar esse?')) return
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
                                                <Box>{user.displayName}</Box>
                                                <Show when={user.uid === loggedUser()?.uid}>
                                                    <Box>(você)</Box>
                                                </Show>
                                                <Show when={user.customClaims?.admin}>
                                                    <AdminPanelSettings fontSize="small" />
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
                                                >
                                                    {user.disabled ? <Person /> : <PersonOff />}
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
                </Show>
            </Box>
        </Container>
    )
}

export default UsersList

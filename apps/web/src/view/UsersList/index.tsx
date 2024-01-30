import { Component, For, Show, createResource, createSignal } from 'solid-js'

import DashboardContainer from '@components/DashboardContainer'
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
import { IGetUsers, getUsersUseCase } from '@useCases/user/getUsers'
import { removeUserUseCase } from '@useCases/user/removeUser'
import { toggleAdminAccessUseCase } from '@useCases/user/toggleAdminAccess'
import { toggleEnableUserUseCase } from '@useCases/user/toggleEnableUser'
import { getErrorMessage } from '@utils/errors'
import { redirectToLogin } from '@utils/redirectToLogin'

const UsersList: Component = () => {
    redirectToLogin()

    const [loadinAction, setLoadingAction] = createSignal<string | null>(null)
    const [currentPage, setCurrentPage] = createSignal<number>(0)

    const [listResult, { refetch }] = createResource(() => {
        return {
            order: 'asc',
            sortBy: 'displayName',
            page: currentPage(),
            pageSize: 10,
        } as IGetUsers
    }, getUsersUseCase)

    const handleToggleAdminAccess = async (uid: string, action: 'promote' | 'demote') => {
        if (action === 'demote') {
            if (!confirm('Tem certeza que deseja remover o a função ADM desse usuário?')) return
        } else {
            if (!confirm('Tem certeza que deseja tornar esse usuário um ADM?')) return
        }

        try {
            setLoadingAction(uid)
            await toggleAdminAccessUseCase(uid, action)
            await refetch()
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setLoadingAction(null)
        }
    }

    const handleToggleEnableUser = async (uid: string, action: 'enable' | 'disable') => {
        if (action === 'disable') {
            if (!confirm('Tem certeza que deseja ativar esse?')) return
        } else {
            if (!confirm('Tem certeza que deseja desativar esse usuário?')) return
        }
        try {
            setLoadingAction(uid)
            await toggleEnableUserUseCase(uid, action)

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
        const nextPage = listResult()?.nextPage || 0
        if (!nextPage) return
        setCurrentPage(nextPage)
    }

    const handlePrevPage = () => {
        const prevPage = currentPage() - 1
        if (prevPage < 0) return
        setCurrentPage(prevPage)
    }

    return (
        <DashboardContainer>
            <Container maxWidth="lg">
                <Box mt={6}>
                    <Typography variant="h1" fontSize={28} mb={8} fontWeight="bold">
                        Lista de usuários{' '}
                        <Show when={listResult.loading}>
                            <CircularProgress size={20} color="warning" />
                        </Show>
                    </Typography>

                    <Show when={listResult()?.items.length}>
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
                                <For each={listResult()?.items}>
                                    {(user) => {
                                        return (
                                            <TableRow>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1}>
                                                        <Box fontWeight="bold">{user.displayName}</Box>
                                                        <Show when={user.id === loggedUser()?.id}>
                                                            <Box>(você)</Box>
                                                        </Show>
                                                        <Show when={user.admin}>
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
                                                <TableCell>{user.phone}</TableCell>
                                                <TableCell>
                                                    <Show when={loadinAction() === user.id}>
                                                        <CircularProgress size={20} color="warning" />
                                                    </Show>
                                                    <Show when={!loadinAction() || loadinAction() !== user.id}>
                                                        <IconButton
                                                            title={
                                                                user.disabled ? 'Ativar usuário' : 'Inativar usuário'
                                                            }
                                                            onClick={() =>
                                                                handleToggleEnableUser(
                                                                    user.id,
                                                                    user.disabled ? 'enable' : 'disable'
                                                                )
                                                            }
                                                            disabled={user.id === loggedUser()?.id}
                                                            color={user.disabled ? 'error' : 'success'}
                                                        >
                                                            {user.disabled ? <ToggleOn /> : <ToggleOff />}
                                                        </IconButton>
                                                        <IconButton
                                                            title={user.admin ? 'Remover função ADM' : 'Tornar ADM'}
                                                            onClick={() =>
                                                                handleToggleAdminAccess(
                                                                    user.id,
                                                                    user.admin ? 'demote' : 'promote'
                                                                )
                                                            }
                                                            disabled={user.id === loggedUser()?.id}
                                                        >
                                                            {user.admin ? <PersonRemove /> : <PersonAdd />}
                                                        </IconButton>
                                                        <IconButton
                                                            title="Excluir usuário"
                                                            onClick={() => handleRemoveUser(user.id)}
                                                            disabled={user.id === loggedUser()?.id}
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </Show>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }}
                                </For>
                            </TableBody>
                        </Table>
                        <Pagination onClickNext={handleNextPage} onClickPrev={handlePrevPage} />
                    </Show>
                </Box>
            </Container>
        </DashboardContainer>
    )
}

export default UsersList

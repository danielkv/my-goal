import { Component, createResource, createSignal } from 'solid-js'
import { For } from 'solid-js'

import DashboardContainer from '@components/DashboardContainer'
import Pagination from '@components/Pagination'
import ProgramItem from '@components/ProgramItem'
import { useNavigate } from '@solidjs/router'
import { Box, Button, Container, Stack } from '@suid/material'
import { ListProgramsFilter, listProgramsUseCase } from '@useCases/programs/listPrograms'

const ProgramListScreen: Component = () => {
    const navigate = useNavigate()

    const [currentPage, setCurrentPage] = createSignal<number>(0)

    const [listResult] = createResource(() => {
        return {
            order: 'desc',
            sortBy: 'created_at',
            page: currentPage(),
            pageSize: 10,
        } as ListProgramsFilter
    }, listProgramsUseCase)

    return (
        <DashboardContainer>
            <Container maxWidth="sm">
                <Box mt={3}>
                    <Button onClick={() => navigate('/dashboard/program/new')} variant="contained">
                        Novo programa
                    </Button>
                </Box>
                <Stack py={3} gap={3}>
                    <For each={listResult()?.items}>{(program) => <ProgramItem program={program} />}</For>
                </Stack>
            </Container>
            <Stack alignItems="center">
                <Pagination
                    onClickNext={() => setCurrentPage((value) => value + 1)}
                    onClickPrev={() => setCurrentPage((value) => value - 1)}
                />
            </Stack>
        </DashboardContainer>
    )
}

export default ProgramListScreen

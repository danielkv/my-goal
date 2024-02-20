import { Component } from 'solid-js'

import DashboardContainer from '@components/DashboardContainer'
import ProgramItem from '@components/ProgramItem'
import { useNavigate } from '@solidjs/router'
import { Box, Button, Container, Stack } from '@suid/material'

const ProgramListScreen: Component = () => {
    const navigate = useNavigate()

    return (
        <DashboardContainer>
            <Container maxWidth="sm">
                <Box mt={3}>
                    <Button onClick={() => navigate('/dashboard/program/new')} variant="contained">
                        Novo programa
                    </Button>
                </Box>
                <Stack py={3} gap={3}>
                    <ProgramItem
                        program={{
                            amount: 10,
                            block_segments: 'weekly',
                            name: 'Aprenda fazer muscle-up em 10 semanas',
                            expiration: 10,
                            image: 'https://i0.wp.com/ouvidoria.jaboatao.pe.gov.br/wp-content/uploads/2023/10/placeholder-88.png?w=1200&ssl=1',
                            created_at: '',
                            id: 'asds',
                        }}
                    />
                </Stack>
            </Container>
        </DashboardContainer>
    )
}

export default ProgramListScreen

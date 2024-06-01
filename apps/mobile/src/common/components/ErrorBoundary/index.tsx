import { Component, PropsWithChildren } from 'react'

import { Stack } from 'tamagui'

import { firebaseProvider } from '@common/providers/firebase'
import AlertBox from '@components/AlertBox'
import Button from '@components/Button'
import { getErrorMessage } from '@utils/getErrorMessage'

interface ErrorBoundaryState {
    error: boolean
    errorInfo: null | string
}

interface ErrorBoundaryProps extends PropsWithChildren {}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state = {
        error: false,
        errorInfo: null,
    }

    static getDerivedStateFromError() {
        return { error: true }
    }

    componentDidCatch(error: any, errorInfo: any) {
        this.setState({ error, errorInfo })
        firebaseProvider.recordError(error)
    }

    handleGoBackHome() {
        this.setState({ error: false })
    }

    render() {
        if (!this.state.error) return this.props.children

        return (
            <Stack flex={1} bg="$gray9" ai="center" jc="center">
                <AlertBox type="error" text={getErrorMessage(this.state.error)} title="Ocorreu um erro na aplicação" />
                <Button mt="$5" variant="primary" onPress={() => this.handleGoBackHome()}>
                    Voltar para o início
                </Button>
            </Stack>
        )
    }
}

export default ErrorBoundary

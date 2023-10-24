import { Component } from 'react'

import { Stack } from 'tamagui'

import AlertBox from '@components/AlertBox'
import { logMessageUseCase } from '@useCases/log/logMessage'
import { createAppException } from '@utils/exceptions/AppException'
import { getErrorMessage } from '@utils/getErrorMessage'

export class ErrorBoundary extends Component<any, any> {
    state = {
        error: false,
        errorInfo: false,
    }

    static getDerivedStateFromError() {
        return { error: true }
    }

    componentDidCatch(error: any, errorInfo: any) {
        const logError = createAppException('ERROR_BOUNDARY', error, errorInfo)
        logMessageUseCase(logError.toObject())

        this.setState({ error: true, errorInfo })
    }

    render() {
        if (!this.state.error) return this.props.children

        return (
            <Stack flex={1} bg="$gray9" ai="center" jc="center">
                <AlertBox
                    type="error"
                    text={getErrorMessage(this.state.errorInfo)}
                    title="Ocorreu um erro na aplicação"
                />
            </Stack>
        )
    }
}

export default ErrorBoundary

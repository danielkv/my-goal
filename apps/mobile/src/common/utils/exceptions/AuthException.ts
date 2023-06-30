import { statusCodes } from '@react-native-google-signin/google-signin'
import { getErrorMessage } from '@utils/getErrorMessage'

export class AuthException extends Error {
    readonly code: string = 'AUTH_ERROR'

    constructor(err: any) {
        const message = err.code ? codesToMessageMap[err.code] || getErrorMessage(err) : getErrorMessage(err)

        super(message)

        if (err.code) this.code = err.code
    }
}

const appleErrorCodes = {
    ERR_INVALID_OPERATION: 'Operação inválida.',
    ERR_INVALID_RESPONSE: 'Autorização inválida',
    ERR_INVALID_SCOPE: 'Autorização inválida',
    ERR_REQUEST_CANCELED: 'Operação cancelada',
    ERR_REQUEST_FAILED: 'Autenticação falhou',
    ERR_REQUEST_NOT_HANDLED: 'Autorização não foi processada.',
    ERR_REQUEST_NOT_INTERACTIVE: 'A autorização não é interativa',
    ERR_REQUEST_UNKNOWN: 'Erro desconhecido',
}

const googleErrorCodes = {
    [statusCodes.IN_PROGRESS]: 'O login já está em progresso',
    [statusCodes.PLAY_SERVICES_NOT_AVAILABLE]: 'Play Services não está disponível. Tente novamente mais tarde',
    [statusCodes.SIGN_IN_REQUIRED]: 'Login obrigatório',
    [statusCodes.SIGN_IN_CANCELLED]: 'Login cancelado',
}

const codesToMessageMap: Record<string, string> = { ...appleErrorCodes, ...googleErrorCodes }

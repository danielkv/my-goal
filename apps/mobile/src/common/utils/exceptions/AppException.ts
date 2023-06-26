import { Platform } from 'react-native'

import { getErrorMessage } from '@utils/getErrorMessage'

export class AppException extends Error {
    readonly type!: string
    readonly extraInfo?: any

    constructor(type: string, message: string, extraInfo?: any) {
        super(message)

        this.extraInfo = extraInfo
        this.type = type
    }

    toObject(): Record<string, any> {
        return {
            message: this.message,
            type: this.name,
            platform: `${Platform.OS} v${Platform.Version}`,
            extraInfo: this.extraInfo || undefined,
        }
    }
}

export function createAppException(type: string, err: any, errorInfo?: any) {
    if (err instanceof Error) {
        return new AppException(type, err.message, { ...errorInfo, stack: err.stack, cause: err.cause as string })
    }

    return new AppException(type, getErrorMessage(err), errorInfo)
}

export function isAppException(err: any): err is AppException {
    if (err instanceof AppException) return true

    if (err.type && err.message && err.platform && err.toObject) return true

    return false
}

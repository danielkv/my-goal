export function getErrorMessage(err: any): string {
    if (import.meta.env.DEV) console.error('MESSAGE CAUGHT', err)

    if (err instanceof Error || err.message) return err.message

    if (typeof err === 'string') return err

    return 'Erro desconhecido'
}

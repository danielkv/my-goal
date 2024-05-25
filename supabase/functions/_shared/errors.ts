export function getErrorMessage(err: any): string {
    if (typeof err === 'string') return err
    if (err.message) return err.message
    if (err.code) return err.code
    if (err.statusText) return err.statusText

    return 'Erro desconhecido'
}

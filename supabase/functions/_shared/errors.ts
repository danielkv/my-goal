import express from 'npm:express@4.18.2'

export function getErrorMessage(err: any): string {
    if (typeof err === 'string') return err
    if (err.message) return err.message
    if (err.code) return err.code
    if (err.statusText) return err.statusText

    return 'Erro desconhecido'
}

export const handleErrorMiddleware = (
    // deno-lint-ignore no-explicit-any
    err: any,
    _: express.Request,
    res: express.Response,
    _next: express.NextFunction
) => {
    const errStatus = err.statusCode || 500
    const errMsg = getErrorMessage(err)
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: Deno.env.get('IS_DEV') ? err.stack : {},
    })
}

import { isAdmin } from './isAdmin.ts'
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts'
import { NextFunction, Request, Response } from 'npm:@types/express@4.17.15'

export function validateSchema(schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync(req.body)
            next()
        } catch (error) {
            let err = error
            if (err instanceof z.ZodError) {
                err = err.issues.map((e) => ({ path: e.path[0], message: e.message }))
            }
            return res.status(400).json({
                status: 'failed',
                error: err,
            })
        }
    }
}

export async function checkIsAdminMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!(await isAdmin(req.header('Authorization')!))) return res.status(403).send('Sem permissões para esta ação')

    next()
}

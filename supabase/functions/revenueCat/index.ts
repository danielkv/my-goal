import { handleErrorMiddleware } from '../_shared/errors.ts'
import { validateSchema } from '../_shared/middlewares.ts'
import { checkIsAdminMiddleware } from '../_shared/middlewares.ts'
import { RevenueCat } from '../_shared/revenuecat.ts'
import {
    GrantPromotionalEntitlementBody,
    grantPromotionalEntitlementSchema,
    revokePromotionalEntitlementSchema,
} from './types.ts'
import { RevokePromotionalEntitlementBody } from './types.ts'
import cors from 'npm:cors'
// @deno-types="npm:@types/express@4.17.15"
import express, { NextFunction, Request, Response } from 'npm:express@4.18.2'

const port = 3000
const app = express()

app.use(express.json())
app.use(cors())

app.get('/revenueCat/getSubscriber/:app_user_id', checkIsAdminMiddleware, async (req, res) => {
    const apiKey = Deno.env.get('REVENUECAT_API_KEY')
    if (!apiKey) return res.status(400).send('RevenueCat API key not found')
    const { app_user_id } = req.params
    if (!app_user_id) return res.status(400).send('UserId not found')

    const revenueCat = new RevenueCat(apiKey)

    const response = await revenueCat.getSubscriber(app_user_id)

    return res.json(response)
})

app.post(
    '/revenueCat/grantPromotionalEntitlement/',
    checkIsAdminMiddleware,
    validateSchema(grantPromotionalEntitlementSchema),
    async (req: Request<unknown, unknown, GrantPromotionalEntitlementBody>, res: Response, next: NextFunction) => {
        try {
            const apiKey = Deno.env.get('REVENUECAT_API_KEY')
            if (!apiKey) throw new Error('RevenueCat API key not found')
            const { app_user_id, duration, entitlement_identifier, start_time_ms } = req.body

            console.log(app_user_id, duration, entitlement_identifier, start_time_ms)

            const revenueCat = new RevenueCat(apiKey)

            const response = await revenueCat.grantPromotionalEntitlement(
                app_user_id,
                entitlement_identifier,
                duration,
                start_time_ms
            )

            return res.json(response)
        } catch (err) {
            next(err)
        }
    }
)

app.post(
    '/revenueCat/revokePromotionalEntitlement/',
    checkIsAdminMiddleware,
    validateSchema(revokePromotionalEntitlementSchema),
    async (req: Request<unknown, unknown, RevokePromotionalEntitlementBody>, res: Response, next: NextFunction) => {
        try {
            const apiKey = Deno.env.get('REVENUECAT_API_KEY')
            if (!apiKey) return res.status(400).send('RevenueCat API key not found')
            const { app_user_id, entitlement_identifier } = req.body

            const revenueCat = new RevenueCat(apiKey)

            const response = await revenueCat.revokePromotionalEntitlement(app_user_id, entitlement_identifier)

            return res.json(response)
        } catch (err) {
            next(err)
        }
    }
)

app.use(handleErrorMiddleware)

app.listen(port, () => {
    console.log('listening on port:', port)
})

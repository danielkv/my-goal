import { createAsaas } from '../_shared/asaas/index.ts'
import { PaymentLink } from '../_shared/asaas/paymentLink-types.ts'
import { BillingType, ChargeType } from '../_shared/asaas/types.ts'
import { checkIsAdminMiddleware } from '../_shared/middlewares.ts'
import { validateSchema } from '../_shared/middlewares.ts'
import { createStripe } from '../_shared/stripe.ts'
import { savePaymentLinkSchema } from './schema.ts'
import { CreateProgramProductSchema, createProgramProductSchema } from './schema.ts'
import { UpdateProgramProductSchema } from './schema.ts'
import { SavePaymentLinkSchema } from './schema.ts'
import { updateProgramProductSchema } from './schema.ts'
// @deno-types="npm:@types/cors@2.8.5"
import cors from 'npm:cors@2.8.5'
// @deno-types="npm:@types/express@4.17.15"
import express from 'npm:express@4.18.2'

const port = 3000
const app = express()

app.use(express.json())
app.use(
    cors({
        preflightContinue: true,
    })
)

// deno-lint-ignore no-explicit-any
app.post<any, unknown, CreateProgramProductSchema>(
    '/payments/stripe/create-program-product',
    checkIsAdminMiddleware,
    validateSchema(createProgramProductSchema),
    async (req, res) => {
        try {
            const { name, programId, price } = req.body
            const stripe = createStripe()

            const stripePrice = await stripe.prices.create({
                currency: 'brl',
                unit_amount: price,
                product_data: { name, metadata: { programId: programId || '', category: 'program' } },
            })

            await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price: stripePrice.id,
                        quantity: 3,
                    },
                ],
                mode: 'payment',
                success_url: 'https://mygoal.app',
                allow_promotion_codes: true,
                payment_method_options: {
                    card: {
                        installments: {
                            enabled: true,
                        },
                    },
                },
            })

            const paymentLink = await stripe.paymentLinks.create({
                line_items: [
                    {
                        price: stripePrice.id,
                        quantity: 1,
                    },
                ],
                allow_promotion_codes: true,
            })

            res.json({ product_id: stripePrice.product, payment_url: paymentLink.url, payment_link_id: paymentLink.id })
        } catch (err) {
            console.log(err.message)
            res.status(400).send(err)
        }
    }
)

// deno-lint-ignore no-explicit-any
app.post<any, unknown, UpdateProgramProductSchema>(
    '/payments/stripe/update-program-product',
    checkIsAdminMiddleware,
    validateSchema(updateProgramProductSchema),
    async (req, res) => {
        try {
            const { price, product_id } = req.body
            const stripe = createStripe()

            const stripePrice = await stripe.prices.create({
                currency: 'brl',
                unit_amount: price,
                product: product_id,
            })

            const paymentLink = await stripe.paymentLinks.create({
                line_items: [
                    {
                        price: stripePrice.id,
                        quantity: 1,
                    },
                ],
                allow_promotion_codes: true,
            })

            res.json({ product_id: stripePrice.product, payment_url: paymentLink.url, payment_link_id: paymentLink.id })
        } catch (err) {
            console.log(err.message)
            res.status(400).send(err)
        }
    }
)

// deno-lint-ignore no-explicit-any
app.post<any, unknown, SavePaymentLinkSchema>(
    '/payments/save-payment-link',
    checkIsAdminMiddleware,
    validateSchema(savePaymentLinkSchema),
    async (req, res) => {
        try {
            const { name, price, payment_link_id } = req.body
            const asaas = createAsaas()

            let paymentLink: PaymentLink

            console.log('SAVING PAYMENT LINK: ', price, payment_link_id)

            if (payment_link_id) {
                paymentLink = await asaas.updatePaymentLink(payment_link_id, {
                    name,
                    value: price,
                })
            } else {
                paymentLink = await asaas.createPaymentLink({
                    billingType: BillingType.UNDEFINED,
                    chargeType: ChargeType.INSTALLMENT,
                    maxInstallmentCount: 10,
                    dueDateLimitDays: 1,
                    name,
                    description: name,
                    value: price,
                    notificationEnabled: false,
                })
            }

            res.json({ payment_link_id: paymentLink.id, payment_link_url: paymentLink.url })
        } catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
)

app.listen(port, () => {
    console.log('listening on port:', port)
})

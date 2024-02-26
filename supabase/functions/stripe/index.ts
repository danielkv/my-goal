import { checkIsAdminMiddleware } from '../_shared/middlewares.ts'
import { validateSchema } from '../_shared/middlewares.ts'
import { createStripe } from '../_shared/stripe.ts'
import { CreateProgramProductSchema, createProgramProductSchema } from './schema.ts'
import { UpdateProgramProductSchema } from './schema.ts'
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
    '/stripe/create-program-product',
    checkIsAdminMiddleware,
    validateSchema(createProgramProductSchema),
    async (req, res) => {
        try {
            const { name, programId, price } = req.body
            const stripe = createStripe()

            const stripePrice = await stripe.prices.create({
                currency: 'brl',
                unit_amount: price,
                product_data: { name, metadata: { programId: programId || '' } },
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
    '/stripe/update-program-product',
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

// // deno-lint-ignore no-explicit-any
// app.post<any, unknown, DeleteProgramProductSchema>(
//     '/stripe/delete-program-product',
//     checkIsAdminMiddleware,
//     validateSchema(deleteProgramProductSchema),
//     async (req, res) => {
//         try {
//             const { productId } = req.body
//             const stripe = createStripe()
//             const product = await stripe.products.del(productId)

//             res.json(product)
//         } catch (err) {
//             res.status(400).send(err)
//         }
//     }
// )

app.listen(port, () => {
    console.log('listening on port:', port)
})

import { createSupabaseClient, createSupabaseSuperClient } from '../_shared/client.ts'
import { checkIsAdminMiddleware } from '../_shared/middlewares.ts'
import { RevenueCat } from '../_shared/revenuecat.ts'
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

app.post('/users/confirm-migrated-user', async (req, res) => {
    const { fbuid } = req.body

    const client = createSupabaseClient(req.header('Authorization')!)

    const { error, data } = await client.auth.getUser()
    if (error) return res.status(500).send(error.message)

    if (data.user.user_metadata.fbuid !== fbuid) return res.status(403).send('Invalid credentials')

    const superClient = createSupabaseSuperClient()

    const { error: updateError } = await superClient.auth.admin.updateUserById(data.user.id, { email_confirm: true })
    if (updateError) return res.status(500).send(updateError.message)

    return res.send('ok')
})

app.get('/users', checkIsAdminMiddleware, async (req, res) => {
    const page = req.query.page ? Number(req.query.page) : 0
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 0
    const sortBy = req.query.sortBy ? String(req.query.sortBy) : 'displayName'
    const order = req.query.order ? String(req.query.order) : 'asc'
    const search = req.query.search ? String(req.query.search) : ''

    const superClient = createSupabaseSuperClient()

    const from = page * pageSize
    const to = from + pageSize

    const query = superClient
        .from('users')
        .select('*', { count: 'exact' })
        .range(from, to - 1)
        .order(sortBy, { ascending: !(order.toLocaleLowerCase() === 'desc') })

    if (search.length) query.or(`displayName.ilike.%${search}%,email.ilike.%${search}%`)

    const { error, data, count } = await query

    if (error) return res.status(500).send(error.message)
    if (!count) return res.status(404).send('No users found')

    const lastPage = Math.ceil(count / pageSize)
    const nextPage = page + 1 >= lastPage ? null : page + 1
    const response = {
        items: data,
        lastPage,
        nextPage,
        total: count,
    }

    return res.json(response)
})

app.get('/users/:id', checkIsAdminMiddleware, async (req, res) => {
    const apiKey = Deno.env.get('REVENUECAT_API_KEY')
    if (!apiKey) return res.status(400).send('RevenueCat API key not found')
    const { id } = req.params
    if (!id) return res.status(400).send('UserId not found')

    const client = createSupabaseSuperClient()

    const { error: userError, data: userData } = await client.from('users').select('*').eq('id', id).single()
    if (userError) throw userError
    if (!userData) throw new Error('Usuário não encontrado')

    const revenueCat = new RevenueCat(apiKey, false)

    const response = await revenueCat.getSubscriber(userData.email)

    return res.json({
        ...userData,
        subscriptions: response.subscriber.subscriptions,
        entitlements: response.subscriber.entitlements,
    })
})

app.listen(port, () => {
    console.log('listening on port:', port)
})

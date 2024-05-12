import { Customer } from './customer-types.ts'
import { CreatePaymentLinkInput, PaymentLink } from './paymentLink-types.ts'
import { AsaasBuilder } from './types.ts'

export class Asaas {
    static readonly SANDBOX_BASE_URL = 'https://sandbox.asaas.com/api/v3'
    static readonly PROD_BASE_URL = 'https://api.asaas.com/v3'

    public sandbox!: boolean
    private readonly access_token!: string

    constructor(options: AsaasBuilder) {
        if (!options.access_token) throw new Error('ASAAS ACCESS TOKEN IS EMPTY')
        this.sandbox = !!options.sandbox
        this.access_token = options.access_token
    }

    getBaseUrl(sandbox?: boolean) {
        if (sandbox === true || this.sandbox) return Asaas.SANDBOX_BASE_URL

        return Asaas.PROD_BASE_URL
    }

    getHeaders(headers?: HeadersInit): HeadersInit {
        return {
            'Content-Type': 'application/json',
            access_token: this.access_token,
            ...headers,
        }
    }

    getCustomer(id: string): Promise<Customer> {
        return this.request(`/customers/${id}`, 'GET')
    }

    getPaymentLink(id: string): Promise<PaymentLink> {
        return this.request(`/paymentLinks/${id}`, 'GET')
    }

    createPaymentLink(data: CreatePaymentLinkInput): Promise<PaymentLink> {
        return this.request('/paymentLinks', 'POST', { body: JSON.stringify(data) })
    }

    updatePaymentLink(id: string, data: Partial<CreatePaymentLinkInput>): Promise<PaymentLink> {
        return this.request(`/paymentLinks/${id}`, 'PUT', { body: JSON.stringify(data) })
    }

    private async request<R>(path: string, method: string, options?: Omit<RequestInit, 'method'>): Promise<R> {
        const headers = this.getHeaders(options?.headers)
        const url = `${this.getBaseUrl()}${path}`

        const response = await fetch(url, { ...options, method, headers })

        try {
            const jsonResponse = await response.json()

            if (!response.ok) throw jsonResponse

            return jsonResponse as R
        } catch {
            throw new Error(response.statusText)
        }
    }
}

export function createAsaas(sandbox?: boolean) {
    const _sandbox = sandbox || Deno.env.get('ASAAS_ENABLE_SANDBOX')! === 'true'
    const access_token = Deno.env.get('ASAAS_API_KEY')!

    return new Asaas({ access_token, sandbox: _sandbox })
}

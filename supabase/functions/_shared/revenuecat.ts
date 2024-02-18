import { PromotionalPeriod } from './types.ts'

export class RevenueCat {
    constructor(private apiKey: string, private sandbox = false) {}

    private getHeaders(headers?: HeadersInit): HeadersInit {
        return {
            accept: 'application/json',
            'content-type': 'application/json',
            authorization: `Bearer ${this.apiKey}`,
            'X-Is-Sandbox': this.sandbox ? 'true' : 'false',
            ...headers,
        }
    }

    private getOptions(options?: RequestInit): RequestInit {
        return {
            ...options,
            headers: this.getHeaders(options?.headers),
        }
    }

    getSubscriber(app_user_id: string) {
        return this.fetch(`https://api.revenuecat.com/v1/subscribers/${app_user_id}`, this.getOptions())
    }

    grantPromotionalEntitlement(
        app_user_id: string,
        entitlement_identifier: string,
        duration: PromotionalPeriod,
        start_time_ms?: number
    ) {
        return this.fetch(
            `https://api.revenuecat.com/v1/subscribers/${app_user_id}/entitlements/${entitlement_identifier}/promotional`,
            this.getOptions({ body: JSON.stringify({ duration, start_time_ms }), method: 'POST' })
        )
    }

    revokePromotionalEntitlement(app_user_id: string, entitlement_identifier: string) {
        return this.fetch(
            `https://api.revenuecat.com/v1/subscribers/${app_user_id}/entitlements/${entitlement_identifier}/revoke_promotionals`,
            this.getOptions({ method: 'POST' })
        )
    }

    async fetch(url: string | URL | Request, options?: RequestInit) {
        const response = await fetch(url, options)

        if (!response.ok) throw new Error(response.statusText)

        return response.json()
    }
}

import { PromotionalPeriod } from './types.ts'

export class RevenueCat {
    constructor(private apiKey: string) {}

    private getHeaders(headers?: HeadersInit) {
        return {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
            ...headers,
        }
    }

    private getOptions(options?: RequestInit) {
        return {
            ...options,
            headers: this.getHeaders(options?.headers),
        }
    }

    getSubscriber(app_user_id: string) {
        return fetch(`https://api.revenuecat.com/v1/subscribers/${app_user_id}`, this.getOptions()).then((response) =>
            response.json()
        )
    }

    grantPromotionalEntitlement(
        app_user_id: string,
        entitlement_identifier: string,
        duration: PromotionalPeriod,
        start_time_ms?: number
    ) {
        return fetch(
            `https://api.revenuecat.com/v1/subscribers/${app_user_id}/entitlements/${entitlement_identifier}/promotional`,
            this.getOptions({ body: JSON.stringify({ duration, start_time_ms }), method: 'POST' })
        ).then((response) => response.json())
    }

    revokePromotionalEntitlement(app_user_id: string, entitlement_identifier: string) {
        return fetch(
            `https://api.revenuecat.com/v1/subscribers/${app_user_id}/entitlements/${entitlement_identifier}/revoke_promotionals`,
            this.getOptions({ method: 'POST' })
        ).then((response) => response.json())
    }
}

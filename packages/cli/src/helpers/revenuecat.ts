export class RevenueCat {
    constructor(private apiKey: string, private sandbox = false) {}

    private getHeaders(headers?: Record<string, any>): Record<string, any> {
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

    getSubscriber(app_user_id: string): Record<string, any> {
        return this.fetch(`https://api.revenuecat.com/v1/subscribers/${app_user_id}`, this.getOptions())
    }

    async fetch(url: string | URL | Request, options?: RequestInit) {
        const response = await fetch(url, options)

        if (!response.ok) throw new Error(response.statusText)

        return response.json()
    }
}

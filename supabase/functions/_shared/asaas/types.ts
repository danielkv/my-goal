export interface AsaasBuilder {
    access_token: string
    sandbox?: boolean
}

export enum ChargeType {
    DETACHED = 'DETACHED',
    RECURRENT = 'RECURRENT',
    INSTALLMENT = 'INSTALLMENT',
}

export enum BillingType {
    UNDEFINED = 'UNDEFINED',
    BOLETO = 'BOLETO',
    CREDIT_CARD = 'CREDIT_CARD',
    PIX = 'PIX',
}

export enum PersonType {
    FISICA = 'FISICA',
    JURIDICA = 'JURIDICA',
}

export interface AsaasError {
    errors: {
        code: string
        description: string
    }[]
}

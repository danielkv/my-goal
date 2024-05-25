import { BillingType } from './types.ts'

export interface Installment {
    id: string
    value: number
    netValue: number
    paymentValue: number
    installmentCount: number
    billingType: BillingType
    paymentDate: string | null
    description: string
    expirationDay: number
    deleted: boolean
    dateCreated: string
    customer: string
    paymentLink: string | null
    transactionReceiptUrl: string | null
    chargeback: {
        status: string
        reason: string
    }
}

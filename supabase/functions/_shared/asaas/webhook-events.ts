import { BillingType } from './types.ts'

export enum EventName {
    PAYMENT_CREATED = 'PAYMENT_CREATED', // Geração de nova cobrança.
    PAYMENT_AWAITING_RISK_ANALYSIS = 'PAYMENT_AWAITING_RISK_ANALYSIS', // Pagamento em cartão aguardando aprovação pela análise manual de risco.
    PAYMENT_APPROVED_BY_RISK_ANALYSIS = 'PAYMENT_APPROVED_BY_RISK_ANALYSIS', // Pagamento em cartão aprovado pela análise manual de risco.
    PAYMENT_REPROVED_BY_RISK_ANALYSIS = 'PAYMENT_REPROVED_BY_RISK_ANALYSIS', // Pagamento em cartão reprovado pela análise manual de risco.
    PAYMENT_AUTHORIZED = 'PAYMENT_AUTHORIZED', // Pagamento em cartão que foi autorizado e precisa ser capturado.
    PAYMENT_UPDATED = 'PAYMENT_UPDATED', // Alteração no vencimento ou valor de cobrança existente.
    PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED', // Cobrança confirmada (pagamento efetuado, porém o saldo ainda não foi disponibilizado).
    PAYMENT_RECEIVED = 'PAYMENT_RECEIVED', // Cobrança recebida.
    PAYMENT_CREDIT_CARD_CAPTURE_REFUSED = 'PAYMENT_CREDIT_CARD_CAPTURE_REFUSED', // Falha no pagamento de cartão de crédito
    PAYMENT_ANTICIPATED = 'PAYMENT_ANTICIPATED', // Cobrança antecipada.
    PAYMENT_OVERDUE = 'PAYMENT_OVERDUE', // Cobrança vencida.
    PAYMENT_DELETED = 'PAYMENT_DELETED', // Cobrança removida.
    PAYMENT_RESTORED = 'PAYMENT_RESTORED', // Cobrança restaurada.
    PAYMENT_REFUNDED = 'PAYMENT_REFUNDED', // Cobrança estornada.
    PAYMENT_PARTIALLY_REFUNDED = 'PAYMENT_PARTIALLY_REFUNDED', // Cobrança estornada parcialmente.
    PAYMENT_REFUND_IN_PROGRESS = 'PAYMENT_REFUND_IN_PROGRESS', // Estorno em processamento (liquidação já está agendada, cobrança será estornada após executar a liquidação).
    PAYMENT_RECEIVED_IN_CASH_UNDONE = 'PAYMENT_RECEIVED_IN_CASH_UNDONE', // Recebimento em dinheiro desfeito.
    PAYMENT_CHARGEBACK_REQUESTED = 'PAYMENT_CHARGEBACK_REQUESTED', // Recebido chargeback.
    PAYMENT_CHARGEBACK_DISPUTE = 'PAYMENT_CHARGEBACK_DISPUTE', // Em disputa de chargeback (caso sejam apresentados documentos para contestação).
    PAYMENT_AWAITING_CHARGEBACK_REVERSAL = 'PAYMENT_AWAITING_CHARGEBACK_REVERSAL', // Disputa vencida, aguardando repasse da adquirente.
    PAYMENT_DUNNING_RECEIVED = 'PAYMENT_DUNNING_RECEIVED', // Recebimento de negativação.
    PAYMENT_DUNNING_REQUESTED = 'PAYMENT_DUNNING_REQUESTED', // Requisição de negativação.
    PAYMENT_BANK_SLIP_VIEWED = 'PAYMENT_BANK_SLIP_VIEWED', // Boleto da cobrança visualizado pelo cliente.
    PAYMENT_CHECKOUT_VIEWED = 'PAYMENT_CHECKOUT_VIEWED', // Fatura da cobrança visualizada pelo cliente.
}

export interface ChargeEvent {
    id: string
    event: EventName
    payment: {
        object: 'payment'
        id: string
        dateCreated: string
        customer: string
        subscription?: string
        // somente quando pertencer a uma assinatura
        installment?: string
        // somente quando pertencer a um parcelamento
        paymentLink?: string
        // identificador do link de pagamento
        dueDate: string
        originalDueDate: string
        value: number
        netValue: number
        originalValue: number | null
        // para quando o valor pago é diferente do valor da cobrança
        interestValue: number | null
        nossoNumero: string | null
        description: string
        externalReference: string
        billingType: BillingType
        status: string
        pixTransaction: string | null
        confirmedDate: string
        paymentDate: string
        clientPaymentDate: string
        installmentNumber: number | null
        creditDate: string
        custody: string | null
        estimatedCreditDate: string
        invoiceUrl: string
        bankSlipUrl: string | null
        transactionReceiptUrl: string
        invoiceNumber: string
        deleted: boolean
        anticipated: boolean
        anticipable: boolean
        lastInvoiceViewedDate: string
        lastBankSlipViewedDate: string | null
        postalService: boolean
        creditCard: {
            creditCardNumber: string
            creditCardBrand: string
            creditCardToken: string
        }
        discount: {
            value: number
            dueDateLimitDays: number
            limitedDate: string | null
            type: string
        }
        fine: {
            value: number
            type: string
        }
        interest: {
            value: number
            type: string
        }
        split: [
            {
                walletId: string
                fixedValue: string
                status: string
                refusalReason: string | null
            },
            {
                walletId: string
                percentualValue: string
                status: string
                refusalReason: string | null
            }
        ]
        chargeback: {
            status: string
            reason: string
        }
    }
}

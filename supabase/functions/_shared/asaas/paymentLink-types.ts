import { ChargeType } from './types.ts'
import { BillingType } from './types.ts'

export interface CreatePaymentLinkInput {
    /**
     * Nome do link de pagamentos
     */
    name: string

    /**
     * Descrição do link de pagamentos
     */
    description?: string

    /**
     * Data de encerramento, a partir desta data o seu link de pagamentos será desativado automaticamente
     * @Format YYYY-MM-DD
     */
    endDate?: string

    /**
     * Valor do link de pagamentos, caso não informado o pagador poderá informar o quanto deseja pagar
     */
    value?: number

    /**
     * Forma de pagamento permitida
     */
    billingType: BillingType

    /**
     * Forma de cobrança
     */
    chargeType: ChargeType

    /**
     * Caso seja possível o pagamento via boleto bancário, define a quantidade de dias úteis que o seu cliente poderá pagar o boleto após gerado
     */
    dueDateLimitDays?: number

    /**
     * Periodicidade da cobrança, envio obrigatório caso a forma de cobrança selecionado seja Assinatura
     */
    subscriptionCycle?: string

    /**
     * Quantidade máxima de parcelas que seu cliente poderá parcelar o valor do link de pagamentos caso a forma de cobrança selecionado seja Parcelamento. Caso não informado o valor padrão será de 1 parcela
     */
    maxInstallmentCount?: number

    /**
     * Define se os clientes cadastrados pelo link de pagamentos terão as notificações habilitadas. Caso não seja informado o valor padrão será true
     */
    notificationEnabled?: boolean

    /**
     * Informações de redirecionamento automático após pagamento do link de pagamento
     */
    callback?: {
        /**
         * URL que o cliente será redirecionado após o pagamento com sucesso da fatura ou link de pagamento
         */
        successUrl: string

        /**
         * Definir se o cliente será redirecionado automaticamente ou será apenas informado com um botão para retornar ao site. O padrão é true, caso queira desativar informar false
         */
        autoRedirect?: boolean
    }
}

export interface PaymentLink {
    id: string
    name: string
    value: number
    active: boolean
    chargeType: ChargeType
    url: string
    billingType: BillingType
    subscriptionCycle: null
    description: string
    endDate: '2021-02-05'
    deleted: boolean
    viewCount: number
    maxInstallmentCount: number
    dueDateLimitDays: number
    notificationEnabled: boolean
}

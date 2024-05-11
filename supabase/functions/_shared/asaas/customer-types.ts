import { PersonType } from './types.ts'

export interface Customer {
    id: string
    dateCreated: string
    name: string
    email: string
    phone: string
    mobilePhone: string
    address: string
    addressNumber: string
    complement: string
    province: string
    postalCode: string
    cpfCnpj: string
    personType: PersonType
    deleted: boolean
    additionalEmails: string
    externalReference: string
    notificationDisabled: string
    city: number
    cityName: string
    state: string
    country: string
    observations: string
}

import { isValidPhoneNumber } from 'libphonenumber-js/min'
import * as yup from 'yup'

export type TFormMode = 'new' | 'update'
export type TSubscriptionForm = {
    name: string
    email: string
    password: string
    phoneNumber: string
    mode: TFormMode
}

export const initialValues = (): TSubscriptionForm => {
    if (__DEV__)
        return {
            name: 'Daniel K Guolo',
            email: 'daniel_kv@hotmail.com',
            password: '123456',
            phoneNumber: '48 98844 6691',
            mode: 'new',
        }

    return {
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        mode: 'new',
    }
}

export const validationSchema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório'),
    email: yup.string().required('Email é obrigatório'),
    phoneNumber: yup
        .string()
        .notRequired()
        .test('phoneNumber', 'Telefone inválido', (value) => {
            if (!value) return true

            return isValidPhoneNumber(value, 'BR')
        }),
    password: yup.string().when('mode', {
        is: 'new',
        then: (schema) => schema.required('Senha é obrigatória'),
        otherwise: (schema) => schema.notRequired(),
    }),
})

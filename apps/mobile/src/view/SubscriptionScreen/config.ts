import { isValidPhoneNumber } from 'libphonenumber-js/min'
import * as yup from 'yup'

export type TFormMode = 'new' | 'update'
export type TSubscriptionForm = {
    name: string
    email: string
    password: string
    phoneNumber: string
    mode: TFormMode
    socialLogin: boolean
}

export const initialValues = (): TSubscriptionForm => {
    if (__DEV__)
        return {
            name: 'Daniel K Guolo',
            email: 'daniel_kv@hotmail.com',
            password: '123456',
            phoneNumber: '48 98844 6691',
            socialLogin: false,
            mode: 'new',
        }

    return {
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        socialLogin: false,
        mode: 'new',
    }
}

export const validationSchema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório'),
    email: yup.string().required('Email é obrigatório'),
    phoneNumber: yup
        .string()
        .required('Telefone é obrigatório')
        .test('phoneNumber', 'Telefone inválido', (value) => isValidPhoneNumber(value, 'BR')),
    password: yup.string().when('mode', {
        is: 'new',
        then: (schema) => schema.required('Senha é obrigatória'),
        otherwise: (schema) => schema.notRequired(),
    }),
})

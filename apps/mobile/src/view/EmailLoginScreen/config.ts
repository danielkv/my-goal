import * as yup from 'yup'

export type TLoginForm = { email: string; password: string }

export const initialValues = (): TLoginForm => {
    if (__DEV__)
        return {
            email: 'daniel_kv@hotmail.com',
            password: '123456',
        }

    return {
        email: '',
        password: '',
    }
}

export const validationSchema = yup.object().shape({
    email: yup.string().required('Email é obrigatório'),
    password: yup.string().required('Senha é obrigatória'),
})

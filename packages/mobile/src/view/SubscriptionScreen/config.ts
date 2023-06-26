import * as yup from 'yup'

export type TLoginForm = { name: string; email: string; password: string; phoneNumber: string }

export const initialValues = (): TLoginForm => {
    if (__DEV__)
        return {
            name: 'Daniel K Guolo',
            email: 'daniel_kv@hotmail.com',
            password: '123456',
            phoneNumber: '48 98844 6691',
        }

    return {
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
    }
}

export const validationSchema = yup.object().shape({
    name: yup.string().required('Nome é obrigatório'),
    email: yup.string().required('Email é obrigatório'),
    phoneNumber: yup.string().required('Telefone é obrigatório'),
    password: yup.string().required('Senha é obrigatória'),
})

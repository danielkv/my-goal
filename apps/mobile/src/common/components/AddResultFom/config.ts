import { TResultType } from 'goal-models'
import * as yup from 'yup'

export interface IAddResultForm {
    isPrivate: boolean
    type: TResultType
    date: Date
    value: number
}

export const addResultSchema = yup.object().shape({
    isPrivate: yup.boolean(),
    type: yup.string().required('Tipo é obrigatório'),
    date: yup.string().required('Data é obrigatória'),
    value: yup.number().required('Valor é obrigatório'),
})

export const intialData = (data?: Partial<IAddResultForm>): IAddResultForm => ({
    isPrivate: false,
    type: 'time',
    date: new Date(),
    value: 0,
    ...data,
})

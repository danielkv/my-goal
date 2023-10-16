import { firebaseProvider } from '@common/providers/firebase'
import { IContactForm } from '@view/Home/config'

const sendEmail = firebaseProvider.FUNCTION_CALL<IContactForm, 'ok'>('sendEmail')

export async function sendEmailUseCase(data: IContactForm) {
    const res = await sendEmail(data)

    return res.data
}

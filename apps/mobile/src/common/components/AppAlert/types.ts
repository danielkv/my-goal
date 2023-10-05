import { ButtonProps } from 'tamagui'

import { ModalProps } from '@components/Modal'

export interface IAlertButton {
    icon?: ButtonProps['icon']
    text: string
    primary?: boolean
    onPress?: () => void
}

export interface IAlertProps extends ModalProps {
    title?: string
    description?: string
    buttons: IAlertButton[]
    cancelable?: boolean
}

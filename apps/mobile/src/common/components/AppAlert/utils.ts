import { create } from 'zustand'

import { IAlertButton, IAlertProps } from './types'

function isAlertButton(value: any): value is IAlertButton {
    return !!value?.text
}

export function alert(title: string, description: string, buttons: IAlertButton[], cancelable?: boolean): void
export function alert(title: string, buttons: IAlertButton[], cancelable?: boolean): void
export function alert(buttons: IAlertButton[], cancelable?: boolean): void
export function alert(
    arg1: string | IAlertButton[],
    arg2?: string | IAlertButton[] | boolean,
    arg3?: IAlertButton[] | boolean,
    arg4?: boolean
): void {
    const handleClose = () => {
        useAppAlertState.setState({ open: false, buttons: [], title: '', description: '' })
    }

    if (Array.isArray(arg1) && arg1.every(isAlertButton))
        return useAppAlertState.setState({
            open: true,
            buttons: arg1,
            cancelable: typeof arg2 === 'boolean' && arg2,
            onClose: handleClose,
        })

    if (Array.isArray(arg2) && arg2.every(isAlertButton))
        return useAppAlertState.setState({
            open: true,
            title: arg1,
            buttons: arg2,
            cancelable: typeof arg3 === 'boolean' && arg3,
            onClose: handleClose,
        })

    if (Array.isArray(arg3) && arg3.every(isAlertButton))
        return useAppAlertState.setState({
            open: true,
            title: arg1,
            description: typeof arg2 === 'string' ? arg2 : undefined,
            buttons: arg3,
            cancelable: typeof arg4 === 'boolean' && arg4,
            onClose: handleClose,
        })
}

export const useAppAlertState = create<IAlertProps>(() => ({
    open: false,
    buttons: [],
    onClose: () => {},
}))

import { Separator, Text } from 'tamagui'

import Button from '@components/Button'
import Modal from '@components/Modal'
import Paper from '@components/Paper'
import { useBackHandler } from '@react-native-community/hooks'

import { IAlertProps } from './types'

const AppAlert: React.FC<IAlertProps> = ({ cancelable, buttons, title, description, ...modalProps }) => {
    useBackHandler(() => {
        if (!modalProps.open) return false

        if (cancelable) modalProps.onClose()
        return true
    })

    return (
        <Modal {...modalProps} closeOnPressOverlay={cancelable}>
            <Paper>
                {!!title && (
                    <Text textAlign="center" fontWeight="700">
                        {title}
                    </Text>
                )}
                {!!description && <Text>{description}</Text>}
                {buttons.map((button, index) => (
                    <Button
                        key={`${button.text}_${index}`}
                        onPress={() => {
                            button.onPress?.()
                            modalProps.onClose()
                        }}
                        icon={button.icon}
                        bg={button.primary ? 'white' : '$gray9'}
                        color={button.primary ? '$gray9' : 'white'}
                    >
                        {button.text}
                    </Button>
                ))}

                {cancelable && (
                    <>
                        <Separator borderColor="$gray9" br={10} width={80} bw={3} alignSelf="center" />

                        <Button onPress={modalProps.onClose}>Fechar</Button>
                    </>
                )}
            </Paper>
        </Modal>
    )
}

export default AppAlert

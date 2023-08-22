// import { Container } from './styles';
import { Separator, Text } from 'tamagui'

import Button from '@components/Button'
import Modal from '@components/Modal'
import Paper from '@components/Paper'
import { useBackHandler } from '@react-native-community/hooks'

import { IAlertProps } from './types'

const AppAlert: React.FC<IAlertProps> = ({ cancelable, buttons, title, description, ...modalProps }) => {
    useBackHandler(() => {
        modalProps.onClose()
        return true
    })

    return (
        <Modal {...modalProps}>
            <Paper>
                {!!title && <Text>{title}</Text>}
                {!!description && <Text>{description}</Text>}
                {buttons.map((button) => (
                    <Button
                        key={button.text}
                        onPress={() => {
                            button.onPress?.()
                            modalProps.onClose()
                        }}
                        icon={button.icon}
                        variant={button.primary ? 'primary' : undefined}
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

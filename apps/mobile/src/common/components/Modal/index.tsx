import { PropsWithChildren } from 'react'
import { ScrollView } from 'react-native'

import { ColorTokens, Dialog, getTokens } from 'tamagui'

import SafeAreaView from '@components/SafeAreaView'

export interface ModalProps {
    open?: boolean
    onClose: () => void
    overlayOpacity?: number
    overlayColor?: ColorTokens
    id?: string
}

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({ overlayColor, open, onClose, children, id }) => {
    const { space } = getTokens()

    return (
        <Dialog open={open} onOpenChange={() => onClose()}>
            <Dialog.Portal jc="center" ai="stretch">
                <Dialog.Overlay
                    onPressOut={() => onClose()}
                    key={`${id || ''}_overlay`}
                    animation="quick"
                    opacity={0.5}
                    bg={overlayColor}
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Dialog.Content
                    key={`${id || ''}_content`}
                    animation={[
                        'quick',
                        {
                            opacity: {
                                overshootClamping: true,
                            },
                        },
                    ]}
                    enterStyle={{ opacity: 0, scale: 0.9 }}
                    exitStyle={{ opacity: 0, scale: 0.95 }}
                    transparent
                    f={1}
                    m={0}
                    p={0}
                >
                    <SafeAreaView keyboardVerticalOffset={0}>
                        <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={{
                                justifyContent: 'center',
                                flexGrow: 1,
                                paddingTop: 30,
                                paddingHorizontal: space['4.5'].val,
                            }}
                        >
                            {children}
                        </ScrollView>
                    </SafeAreaView>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    )
}

export default Modal

import { PropsWithChildren } from 'react'
import { ScrollView, TouchableWithoutFeedback } from 'react-native'

import chroma from 'chroma-js'
import { AnimatePresence, motify } from 'moti'
import { Stack, getTokens } from 'tamagui'

import SafeAreaView from '@components/SafeAreaView'
import { Portal } from '@gorhom/portal'

export interface ModalProps {
    open?: boolean
    onClose: () => void
    overlayOpacity?: number
    overlayColor?: string
    closeOnPressOverlay?: boolean
}

const AnimatedView = motify(Stack)()

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({
    overlayColor = '#000000',
    overlayOpacity = 0.6,
    closeOnPressOverlay = true,
    open,
    onClose,
    children,
}) => {
    const { space } = getTokens()
    const bgColor = chroma(overlayColor).alpha(overlayOpacity).hex()

    return (
        <Portal>
            <AnimatePresence>
                {open && (
                    <Stack position="absolute" top={0} left={0} right={0} bottom={0} zIndex={999} jc="center">
                        <TouchableWithoutFeedback onPress={() => closeOnPressOverlay && onClose()}>
                            <AnimatedView
                                key="overlay"
                                bg={bgColor}
                                from={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                position="absolute"
                                transition={{ duration: 100 }}
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                            />
                        </TouchableWithoutFeedback>
                        <AnimatedView
                            key="content"
                            delay={100}
                            transition={{ duration: 100 }}
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            exitTransition={{ delay: 0 }}
                        >
                            <SafeAreaView keyboardVerticalOffset={0}>
                                <ScrollView
                                    bounces={false}
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
                        </AnimatedView>
                    </Stack>
                )}
            </AnimatePresence>
        </Portal>
    )
}

export default Modal

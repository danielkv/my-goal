import { PropsWithChildren } from 'react'
import { ScrollView } from 'react-native'

import { View } from 'tamagui'

import SafeAreaView from '@components/SafeAreaView'

export interface ModalProps {
    open?: boolean
    onClose?: () => void
    overlayColor?: string
}

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({ overlayColor, open, onClose, children }) => {
    const ovColor = overlayColor || 'rgba(0,0,0,0.5)'

    return (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: ovColor }}>
            <SafeAreaView>
                <ScrollView>{children}</ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default Modal

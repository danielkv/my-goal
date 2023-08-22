import {
    Keyboard,
    KeyboardAvoidingView,
    KeyboardAvoidingViewProps,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native'

import { Stack } from 'tamagui'

interface SafeAreaViewProps extends KeyboardAvoidingViewProps {
    flex?: number | undefined
}

const SafeAreaView: React.FC<SafeAreaViewProps> = ({ children, flex, ...props }) => {
    return (
        <Stack flex={flex}>
            <KeyboardAvoidingView
                style={{ flex: flex, justifyContent: 'center' }}
                enabled={Platform.OS === 'ios'}
                keyboardVerticalOffset={64}
                behavior="padding"
                {...props}
            >
                <TouchableWithoutFeedback onPress={() => Platform.OS === 'android' && Keyboard.dismiss()}>
                    {children}
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Stack>
    )
}

export default SafeAreaView

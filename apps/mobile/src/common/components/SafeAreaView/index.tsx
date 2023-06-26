import {
    Keyboard,
    KeyboardAvoidingView,
    KeyboardAvoidingViewProps,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native'

import { Stack } from 'tamagui'

const SafeAreaView: React.FC<KeyboardAvoidingViewProps> = ({ children, ...props }) => {
    return (
        <Stack flex={1}>
            <KeyboardAvoidingView style={{ flex: 1 }} enabled={Platform.OS === 'ios'} behavior="padding" {...props}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </Stack>
    )
}

export default SafeAreaView

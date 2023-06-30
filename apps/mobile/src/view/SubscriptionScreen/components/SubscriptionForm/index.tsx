import { useRef, useState } from 'react'

import { useFormikContext } from 'formik'
import { YStack } from 'tamagui'

import Button from '@components/Button'
import TextField from '@components/TextField'
import { Eye, EyeOff, Phone, User } from '@tamagui/lucide-icons'

import { TSubscriptionForm } from '../../config'

const SubscriptionForm: React.FC = () => {
    const [hidePassowrd, setHidePassword] = useState(true)
    const inputRefs = useRef<Record<string, any>>({})

    const { handleChange, handleSubmit, values, errors } = useFormikContext<TSubscriptionForm>()

    return (
        <YStack gap="$3" alignItems="center">
            <TextField
                autoFocus
                label="Nome"
                onChangeText={handleChange('name')}
                value={values.name}
                error={errors.name}
                textContentType="name"
                returnKeyType="next"
                ref={(ref) => (inputRefs.current['name'] = ref)}
                onSubmitEditing={() => {
                    inputRefs.current?.email?.focus()
                }}
            />
            <TextField
                label="Email"
                componentLeft={<User color="$gray5" size={22} />}
                keyboardType="email-address"
                onChangeText={handleChange('email')}
                disabled={values.socialLogin}
                value={values.email}
                error={errors.email}
                autoCapitalize="none"
                textContentType="username"
                returnKeyType="next"
                ref={(ref) => (inputRefs.current['email'] = ref)}
                onSubmitEditing={() => {
                    inputRefs.current?.phoneNumber?.focus()
                }}
            />
            <TextField
                label="Telefone"
                keyboardType="phone-pad"
                componentLeft={<Phone color="$gray5" size={22} />}
                onChangeText={handleChange('phoneNumber')}
                value={values.phoneNumber}
                error={errors.phoneNumber}
                returnKeyType="next"
                ref={(ref) => (inputRefs.current['phoneNumber'] = ref)}
                onSubmitEditing={() => {
                    inputRefs.current?.passwor?.focus()
                }}
            />
            {values.mode === 'new' && (
                <TextField
                    label="Senha"
                    onChangeText={handleChange('password')}
                    value={values.password}
                    error={errors.password}
                    textContentType="newPassword"
                    secureTextEntry={hidePassowrd}
                    componentRight={
                        <Button
                            variant="transparent"
                            size="$3"
                            circular
                            onPress={() => setHidePassword(!hidePassowrd)}
                            icon={hidePassowrd ? <Eye size={22} color="$gray5" /> : <EyeOff size={22} color="$gray5" />}
                        />
                    }
                    returnKeyType="next"
                    ref={(ref) => (inputRefs.current['password'] = ref)}
                    onSubmitEditing={() => handleSubmit()}
                />
            )}
        </YStack>
    )
}

export default SubscriptionForm

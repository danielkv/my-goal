import AppleIcon from '@assets/svg/apple-logo.svg'
import GoogleIcon from '@assets/svg/google-logo.svg'
import Button from '@components/Button'
import { Mail } from '@tamagui/lucide-icons'

type TButtonMode = 'google' | 'apple' | 'email'

function getButtonLabel(mode: TButtonMode): string {
    switch (mode) {
        case 'apple':
            return 'Continuar com Apple'
        case 'google':
            return 'Continuar com Google'
        case 'email':
            return 'Continuar com Email'
    }
}

function getButtonIcon(mode: TButtonMode) {
    switch (mode) {
        case 'apple':
            return <AppleIcon width={12} />
        case 'google':
            return <GoogleIcon width={20} />
        case 'email':
            return <Mail size={20} />
    }
}

function getButtonBgColor(mode: TButtonMode): string {
    switch (mode) {
        case 'apple':
            return 'white'
        case 'google':
            return 'white'
        case 'email':
            return 'white'
    }
}

interface LoginButtonProps {
    mode: TButtonMode
    onPress?: () => void
}

const LoginButton: React.FC<LoginButtonProps> = ({ mode, onPress }) => {
    const label = getButtonLabel(mode)
    const Icon = getButtonIcon(mode)
    const bgColor = getButtonBgColor(mode)

    return (
        <Button bg={bgColor} onPress={onPress} icon={Icon} gap="$1" color="black" fontWeight="700">
            {label}
        </Button>
    )
}

export default LoginButton

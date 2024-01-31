import { Component } from 'solid-js'

import AppleIcon from '@assets/svg/apple-logo.svg?component-solid'
import GoogleIcon from '@assets/svg/google-logo.svg?component-solid'
import ActivityIndicator from '@components/ActivityIndicator'
import { MailLock } from '@suid/icons-material'
import { Button, Stack } from '@suid/material'

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
            return <AppleIcon />
        case 'google':
            return <GoogleIcon width="15px" style={{ 'font-size': '15px' }} />
        case 'email':
            return <MailLock />
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
    onClick?: () => void
    loading?: boolean
}

const SocialLoginButton: Component<LoginButtonProps> = ({ mode, loading, onClick }) => {
    const label = getButtonLabel(mode)
    const Icon = getButtonIcon(mode)
    const bgColor = getButtonBgColor(mode)

    return (
        <Button component="a" fullWidth style={{ 'background-color': bgColor, color: 'black' }} onClick={onClick}>
            {loading ? (
                <ActivityIndicator />
            ) : (
                <Stack direction="row" gap={1} justifyItems="center" alignItems="center">
                    {Icon}
                    {label}
                </Stack>
            )}
        </Button>
    )
}

export default SocialLoginButton

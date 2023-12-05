import { ButtonProps, Button as NButton, Spinner, SpinnerProps, styled } from 'tamagui'

const Button = styled(NButton, {
    bg: '$backgroundStrong',
    bw: 0,
    fontWeight: '700',

    variants: {
        variant: {
            primary: {
                bg: '$red5',
                pressStyle: {
                    bg: '$red3',
                },
            },
            transparent: {
                bg: 'transparent',
                pressStyle: {
                    bg: '$gray2',
                },
            },
            link: {
                bg: 'transparent',
                p: 0,
            },
            icon: {
                circular: true,
            },
        },
    },
})

interface IButtonProps {
    loading?: boolean
    spinnerColor?: SpinnerProps['color']
}

export default Button.styleable<IButtonProps>(({ loading, children, spinnerColor, ...props }, ref) => (
    <Button ref={ref} {...(props as ButtonProps)}>
        {loading ? <Spinner color={spinnerColor} /> : children}
    </Button>
))

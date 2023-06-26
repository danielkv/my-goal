import { ButtonProps, Button as NButton, Spinner, styled } from 'tamagui'

const Button = styled(NButton, {
    bg: '$backgroundStrong',
    bw: 0,
    w: '100%',
    fontWeight: '500',
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
}

export default Button.styleable<IButtonProps>(({ loading, children, ...props }, ref) => (
    <Button ref={ref} {...(props as ButtonProps)}>
        {loading ? <Spinner /> : children}
    </Button>
))

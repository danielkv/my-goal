import { SocialLoginProvider } from 'goal-models'

import { Component, onMount } from 'solid-js'

import SocialLoginButton from '@components/SocialLoginButton'
import TextInput from '@components/TextInput'
import { SubmitHandler, createForm, zodForm } from '@modular-forms/solid'
import { useNavigate } from '@solidjs/router'
import { Box, Button, Container, Paper, Stack } from '@suid/material'
import { logUserInUseCase } from '@useCases/user/logUserIn'
import { socialLoginUseCase } from '@useCases/user/socialLogin'
import { getErrorMessage } from '@utils/errors'

import { TLoginForm, loginFormInitialValues, loginFormSchema } from './config'

const LoginPage: Component = () => {
    let input: HTMLInputElement
    const navigate = useNavigate()

    const [_, { Form, Field }] = createForm<TLoginForm>({
        validate: zodForm(loginFormSchema),
        initialValues: loginFormInitialValues,
    })

    const handleSubmit: SubmitHandler<TLoginForm> = async ({ email, password }) => {
        try {
            await logUserInUseCase(email, password)

            navigate('/dashboard')
        } catch (err) {
            alert(getErrorMessage(err))
        }
    }

    const handleSocialLogin = async (provider: SocialLoginProvider) => {
        try {
            await socialLoginUseCase(provider)
        } catch (err) {
            alert((err as Error).message)
        }
    }

    onMount(() => input.focus())

    return (
        <Box height="100%">
            <Stack justifyContent="center" height="100%">
                <Container maxWidth="sm">
                    <Paper>
                        <Box padding={5} maxWidth="sm">
                            <Form name="teste" class="flex flex-col gap-4" onSubmit={handleSubmit}>
                                <Field name="email">
                                    {(field, props) => (
                                        <TextInput
                                            {...props}
                                            ref={(ele) => (input = ele)}
                                            class="flex-1"
                                            label="Email"
                                            value={field.value}
                                            error={field.error}
                                        />
                                    )}
                                </Field>
                                <Field name="password">
                                    {(field, props) => (
                                        <TextInput
                                            {...props}
                                            class="flex-1"
                                            label="Senha"
                                            type="password"
                                            value={field.value}
                                            error={field.error}
                                        />
                                    )}
                                </Field>
                                <Stack direction="row" justifyContent="end" alignItems="center" gap={3}>
                                    <Button variant="text" onClick={() => navigate('/dashboard/password-recovery')}>
                                        Esqueci minha senha
                                    </Button>
                                    <Button variant="contained" type="submit">
                                        Login
                                    </Button>
                                </Stack>
                            </Form>

                            <Box mt={3}>
                                <SocialLoginButton mode="google" onClick={() => handleSocialLogin('google')} />
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Stack>
        </Box>
    )
}

export default LoginPage

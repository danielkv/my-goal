import 'firebaseui/dist/firebaseui.css'

import { Component, Match, Show, Switch, createSignal, onMount } from 'solid-js'

import TextInput from '@components/TextInput'
import { loggedUser } from '@contexts/user/user.context'
import { Field, Form, SubmitHandler, createForm, zodForm } from '@modular-forms/solid'
import { useNavigate, useSearchParams } from '@solidjs/router'
import { Box, Button, Container, Paper, Stack, Typography } from '@suid/material'
import { resetPasswordUseCase } from '@useCases/user/resetPassoword'
import { getErrorMessage } from '@utils/errors'

import { TResetPasswordForm, loginFormSchema, passwordRecoveryFormInitialValues } from './config'

const ResetPasswordPage: Component = () => {
    let input: HTMLInputElement
    const navigate = useNavigate()
    const [params] = useSearchParams<{ token?: string }>()
    const [changed, setChanged] = createSignal(false)

    const form = createForm<TResetPasswordForm>({
        validate: zodForm(loginFormSchema),
        initialValues: passwordRecoveryFormInitialValues,
    })

    const handleSubmit: SubmitHandler<TResetPasswordForm> = async ({ password }) => {
        try {
            if (!params.token) return navigate('/login')

            await resetPasswordUseCase(password, params.token)

            setChanged(true)
        } catch (err) {
            alert(getErrorMessage(err))
        }
    }
    onMount(() => {
        if (!params.token) return navigate('/login')

        input.focus()
    })

    return (
        <Box height="100%">
            <Stack justifyContent="center" height="100%">
                <Container maxWidth="sm">
                    <Paper>
                        <Box padding={5} maxWidth="sm">
                            <Switch>
                                <Match when={changed()}>
                                    <Stack>
                                        <Typography textAlign="center">Sua senha foi alterada</Typography>
                                        <Show when={loggedUser()?.claims.claims_admin}>
                                            <Button onClick={() => navigate('/dashboard')}>Abrir dashboard</Button>
                                        </Show>
                                    </Stack>
                                </Match>
                                <Match when={!changed()}>
                                    <Form<TResetPasswordForm>
                                        of={form}
                                        name="teste"
                                        class="flex flex-col gap-4"
                                        onSubmit={handleSubmit}
                                    >
                                        <Typography>Digite sua nova senha</Typography>
                                        <Field of={form} name="password">
                                            {(field) => (
                                                <TextInput
                                                    {...field.props}
                                                    ref={(ele) => (input = ele)}
                                                    class="flex-1"
                                                    label="Nova senha"
                                                    value={field.value}
                                                    error={field.error}
                                                />
                                            )}
                                        </Field>
                                        <Field of={form} name="repeatPassword">
                                            {(field) => (
                                                <TextInput
                                                    {...field.props}
                                                    class="flex-1"
                                                    label="Repita a senha"
                                                    value={field.value}
                                                    error={field.error}
                                                />
                                            )}
                                        </Field>

                                        <Stack direction="row" justifyContent="end" alignItems="center" gap={3}>
                                            <Button variant="contained" type="submit">
                                                Salvar
                                            </Button>
                                        </Stack>
                                    </Form>
                                </Match>
                            </Switch>
                        </Box>
                    </Paper>
                </Container>
            </Stack>
        </Box>
    )
}

export default ResetPasswordPage

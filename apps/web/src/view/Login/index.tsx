import 'firebaseui/dist/firebaseui.css'

import { Component, onMount } from 'solid-js'

import TextInput from '@components/TextInput'
import { Field, Form, SubmitHandler, createForm, zodForm } from '@modular-forms/solid'
import { useNavigate } from '@solidjs/router'
import { Box, Container, Paper, Stack } from '@suid/material'
import { logUserInUseCase } from '@useCases/user/logUserIn'
import { getErrorMessage } from '@utils/errors'

import { TLoginForm, loginFormInitialValues, loginFormSchema } from './config'

const LoginPage: Component = () => {
    let input: HTMLInputElement
    const navigate = useNavigate()

    const form = createForm<TLoginForm>({
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
    onMount(() => input.focus())

    return (
        <Box height="100%">
            <Stack justifyContent="center" height="100%">
                <Container maxWidth="sm">
                    <Paper>
                        <Box padding={5} maxWidth="sm">
                            <Form<TLoginForm>
                                of={form}
                                name="teste"
                                class="flex flex-col gap-4"
                                onSubmit={handleSubmit}
                            >
                                <Field of={form} name="email">
                                    {(field) => (
                                        <TextInput
                                            {...field.props}
                                            ref={(ele) => (input = ele)}
                                            class="flex-1"
                                            label="Email"
                                            value={field.value}
                                            error={field.error}
                                        />
                                    )}
                                </Field>
                                <Field of={form} name="password">
                                    {(field) => (
                                        <TextInput
                                            {...field.props}
                                            class="flex-1"
                                            label="Senha"
                                            type="password"
                                            value={field.value}
                                            error={field.error}
                                        />
                                    )}
                                </Field>
                                <button class="btn btn-main self-end" type="submit">
                                    Login
                                </button>
                            </Form>
                        </Box>
                    </Paper>
                </Container>
            </Stack>
        </Box>
    )
}

export default LoginPage

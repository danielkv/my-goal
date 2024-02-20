import { Component, onMount } from 'solid-js'

import TextInput from '@components/TextInput'
import { SubmitHandler, createForm, zodForm } from '@modular-forms/solid'
import { useNavigate } from '@solidjs/router'
import { Box, Button, Container, Paper, Stack } from '@suid/material'
import { sendPasswordRecoveryEmail } from '@useCases/user/sendPasswordRecoveryEmail'
import { getErrorMessage } from '@utils/errors'

import { TPasswordRecoveryForm, loginFormSchema, passwordRecoveryFormInitialValues } from './config'

const PasswordRecoveryPage: Component = () => {
    let input: HTMLInputElement
    const navigate = useNavigate()

    const [_, { Form, Field }] = createForm<TPasswordRecoveryForm>({
        validate: zodForm(loginFormSchema),
        initialValues: passwordRecoveryFormInitialValues,
    })

    const handleSubmit: SubmitHandler<TPasswordRecoveryForm> = async ({ email }) => {
        try {
            await sendPasswordRecoveryEmail(email)

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

                                <Stack direction="row" justifyContent="end" alignItems="center" gap={3}>
                                    <Button variant="contained" type="submit">
                                        Enviar
                                    </Button>
                                </Stack>
                            </Form>
                        </Box>
                    </Paper>
                </Container>
            </Stack>
        </Box>
    )
}

export default PasswordRecoveryPage

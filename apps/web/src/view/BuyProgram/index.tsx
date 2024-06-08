import { Component, Suspense, createEffect, createMemo, createResource, createSignal } from 'solid-js'

import WhatsappIcon from '@assets/svg/whatapp-icon.svg'
import TextInput from '@components/TextInput'
import { SubmitHandler, createForm, setValue, zodForm } from '@modular-forms/solid'
import { useParams } from '@solidjs/router'
import { Box, Button, Card, CircularProgress, Stack, Typography } from '@suid/material'
import { addProgramInterestUseCase } from '@useCases/programInterest/addProgramInterest'
import { getProgramByIdUseCase } from '@useCases/programs/getProgramById'
import { getErrorMessage } from '@utils/errors'

import logo from '../../../public/images/logo-full.png'

import { ProgramInterrestForm, initialValues, programInterestSchema } from './config'

const currency = new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' })

const BuyProgram: Component = () => {
    const params = useParams<{ programId: string }>()
    const [loading, setLoading] = createSignal(false)

    const [program] = createResource(params.programId, getProgramByIdUseCase)

    const [form, { Form, Field }] = createForm<ProgramInterrestForm>({
        initialValues,
        validate: zodForm(programInterestSchema),
    })

    createEffect(() => {
        const loadedProgram = program()
        if (!loadedProgram?.id) return
        setValue(form, 'program_id', loadedProgram.id)
    })

    const handleSubmit: SubmitHandler<ProgramInterrestForm> = async (data) => {
        try {
            setLoading(true)
            const loadedProgram = program()

            if (!loadedProgram?.payment_link_url) throw new Error('Link de pagamento do programa não existe')
            await addProgramInterestUseCase(data)

            window.location.href = loadedProgram.payment_link_url
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    const valueDescription = createMemo(() => {
        const value = program()?.amount || 0
        return `${currency.format(value)} ou 10x ${currency.format(value / 10)}`
    })

    return (
        <Stack
            minHeight="100%"
            pt={3}
            pb={10}
            justifyContent="center"
            alignItems="center"
            width={400}
            maxWidth="90%"
            margin="auto"
        >
            <Suspense fallback={<CircularProgress />}>
                <Box mb={3}>
                    <img
                        alt="Goal Workout Plan"
                        src={logo}
                        style={{ width: '180px', height: '60px', 'object-fit': 'cover' }}
                    />
                </Box>
                <Box mb={1} class="bg-red-500 px-2 py-1 rounded-md">
                    <Typography fontSize={18} textTransform="uppercase">
                        {program()?.name}
                    </Typography>
                </Box>
                <Box mb={1} class="bg-gray-500 px-2 py-1 rounded-md">
                    <Typography fontSize={14}>{valueDescription()}</Typography>
                </Box>
                <Box mb={3}>
                    <Typography textAlign="center">
                        Para continuar para o pagamento confirme seus dados abaixo:
                    </Typography>
                </Box>
                <Card sx={{ width: '100%', overflow: 'visible' }}>
                    <Form onSubmit={handleSubmit}>
                        <Stack padding={3} gap={2}>
                            <Field name="name">
                                {(field, props) => (
                                    <TextInput
                                        {...props}
                                        disabled={loading()}
                                        label="Nome"
                                        error={field.error}
                                        value={field.value || ''}
                                    />
                                )}
                            </Field>
                            <Field name="email">
                                {(field, props) => (
                                    <TextInput
                                        {...props}
                                        disabled={loading()}
                                        label="Email"
                                        type="email"
                                        error={field.error}
                                        value={field.value || ''}
                                    />
                                )}
                            </Field>
                            <Field name="phone">
                                {(field, props) => (
                                    <TextInput
                                        {...props}
                                        disabled={loading()}
                                        label="Telefone"
                                        type="tel"
                                        error={field.error}
                                        value={field.value || ''}
                                    />
                                )}
                            </Field>
                            <Field name="program_id">{(field) => <input value={field.value} hidden />}</Field>
                            <Stack mt={2}>
                                <Button disabled={loading()} type="submit" variant="contained">
                                    {loading() ? <CircularProgress size={24} /> : 'Continuar'}
                                </Button>
                            </Stack>
                        </Stack>
                    </Form>
                </Card>
                <Box mt={2}>
                    <Typography fontSize={11}>
                        A privacidade dos seus dados é prioridade para nós. Protegemos seus dados com segurança e não
                        compartilhamos sem consentimento. Clicando no botão "Continuar" acima você aceita receber
                        ofertas e promoções personalisadas.
                    </Typography>
                    <Typography fontSize={11} textAlign="center" mt={2}>
                        Todos os direitos reservados
                    </Typography>
                </Box>
                <Box position="fixed" bottom={20} right={20}>
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Box bgcolor="white" py={0.5} px={1} borderRadius={1}>
                            <Typography class="!text-[13px] text-gray-500">Ainda com dúvidas?</Typography>
                        </Box>
                        <a
                            href="https://api.whatsapp.com/send/?phone=554835190276&text=Ainda+tenho+algumas+dúvidas+sobre+o+program+Destrava+BMU&type=phone_number&app_absent=0"
                            target="_blank"
                        >
                            <Box bgcolor="#25d366" p={1.5} borderRadius={50}>
                                <WhatsappIcon />
                            </Box>
                        </a>
                    </Stack>
                </Box>
            </Suspense>
        </Stack>
    )
}

export default BuyProgram

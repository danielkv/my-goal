import { IProgramInput } from 'goal-models'
import { FiChevronDown, FiChevronUp, FiPlus, FiTrash } from 'solid-icons/fi'
import { TbLayoutBottombarCollapse, TbLayoutNavbarCollapse } from 'solid-icons/tb'

import { Component, For, Show, createMemo, createSignal } from 'solid-js'

import ActivityIndicator from '@components/ActivityIndicator'
import TextInput from '@components/TextInput'
import { SubmitHandler, createForm, getValue, insert, remove, setValue, swap, zodForm } from '@modular-forms/solid'
import { useNavigate } from '@solidjs/router'
import { ChevronRight } from '@suid/icons-material'
import {
    Box,
    Button,
    Container,
    Drawer,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    useMediaQuery,
} from '@suid/material'
import { saveProgramUseCase } from '@useCases/programs/saveProgram'
import { getErrorMessage } from '@utils/errors'
import FileInput from '@view/CreateNewDay/components/FileInput'

import { TProgramForm, createEmptySegment, createEmptySession, programFormSchema } from './config'
import SessionForm from './sessionForm'

interface ProgramFormProps {
    initialValues: IProgramInput
    editing: boolean
}
const ProgramForm: Component<ProgramFormProps> = ({ initialValues, editing }) => {
    const navigate = useNavigate()

    const [loading, setLoading] = createSignal(false)
    const [drawerOpen, setDrawerOpen] = createSignal(false)

    const [form, { Form, Field, FieldArray }] = createForm<TProgramForm>({
        initialValues: initialValues,
        // @ts-expect-error
        validate: zodForm(programFormSchema),
    })

    const handleSubmit: SubmitHandler<TProgramForm> = async (result) => {
        try {
            setLoading(true)
            const { program, error } = await saveProgramUseCase(result)
            if (error) alert(`Atenção! O programa foi salvo com sucesso, porém houve um problema: ${error}`)

            navigate(`/dashboard/program/${program.id}`)
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    const mdScreen = useMediaQuery((theme) => theme.breakpoints.up('md'))
    const xlScreen = useMediaQuery((theme) => theme.breakpoints.up('xl'))

    const contentPadding = createMemo(() => {
        if (xlScreen()) return '500px'
        return mdScreen() ? '300px' : '0'
    })

    return (
        <Form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            <Drawer
                onBackdropClick={() => setDrawerOpen(false)}
                open={drawerOpen()}
                sx={{
                    [`& .MuiDrawer-paper`]: {
                        width: { xs: '300px', xl: '500px' },
                        boxSizing: 'border-box',
                        paddingTop: '80px',
                    },
                }}
                variant={mdScreen() ? 'permanent' : 'temporary'}
            >
                <Stack gap={3} p={3}>
                    <Field name="id" type="string">
                        {(field) => <input value={field.value} hidden />}
                    </Field>
                    <Field type="File" name="image">
                        {(field, props) => (
                            <FileInput
                                {...props}
                                onRemove={() => {
                                    setValue(form, 'image', null)
                                }}
                                value={(field.value as File) || null}
                                error={field.error}
                            />
                        )}
                    </Field>
                    <Field name="name">
                        {(field, props) => (
                            <TextInput {...props} label="Nome" error={field.error} value={field.value || ''} />
                        )}
                    </Field>
                    <Field type="number" name="amount">
                        {(field, props) => (
                            <TextInput
                                {...props}
                                label="Valor"
                                type="number"
                                error={field.error}
                                value={field.value || ''}
                            />
                        )}
                    </Field>
                    <Field type="number" name="expiration">
                        {(field, props) => (
                            <TextInput
                                {...props}
                                label="Expira em"
                                type="number"
                                error={field.error}
                                value={field.value || ''}
                            />
                        )}
                    </Field>
                    <Field name="block_segments">
                        {(field) => (
                            <FormControl variant="outlined" size="small">
                                <InputLabel class="text-sm">Tipo de bloqueio</InputLabel>

                                <Select
                                    error={!!field.error}
                                    style={{
                                        'background-color': 'white',
                                        'border-radius': '0.375rem',
                                        color: '#333',
                                        height: '35px',
                                    }}
                                    sx={{ ['& .MuiSelect-icon']: { color: 'black' } }}
                                    value={field.value}
                                    onChange={(e) => setValue(form, 'block_segments', e.target.value)}
                                >
                                    <MenuItem value="none">Sem bloqueio</MenuItem>
                                    <MenuItem value="weekly">1 semana</MenuItem>
                                    <MenuItem value="monthly">1 mês</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    </Field>
                    <Stack direction="row" gap={3} justifyContent="flex-end">
                        {editing && (
                            <Button
                                color="secondary"
                                variant="contained"
                                disabled={loading()}
                                onClick={() => navigate('/dashboard/programs')}
                            >
                                Cancelar
                            </Button>
                        )}
                        <Button variant="contained" type="submit" disabled={loading()}>
                            {loading() ? <ActivityIndicator color="white" /> : 'Salvar'}
                        </Button>
                    </Stack>
                </Stack>
            </Drawer>
            <div style={{ height: 'calc(100% - 80px)', overflow: 'auto' }}>
                <Box style={{ 'padding-left': contentPadding() }}>
                    <Show when={!mdScreen()}>
                        <IconButton class="!bg-gray-900 hover:!bg-gray-600" onClick={() => setDrawerOpen(true)}>
                            <ChevronRight />
                        </IconButton>
                    </Show>
                    <Container maxWidth="md">
                        <Stack py={2} gap={2}>
                            <FieldArray name="segments">
                                {(segmentsArray) => (
                                    <>
                                        <For each={segmentsArray.items}>
                                            {(_, segmentIndex) => {
                                                const [open, setOpen] = createSignal(
                                                    segmentsArray.items.length <= 1 || !editing
                                                )

                                                const displayContent = createMemo(
                                                    () =>
                                                        open() ||
                                                        getValue(
                                                            form,
                                                            `${segmentsArray.name}.${segmentIndex()}.name`
                                                        ) === ''
                                                )

                                                return (
                                                    <Stack py={2} gap={2}>
                                                        <Stack direction="row" gap={1}>
                                                            <IconButton
                                                                onClick={() => setOpen((current) => !current)}
                                                                class="!bg-gray-700"
                                                            >
                                                                {open() ? (
                                                                    <TbLayoutNavbarCollapse />
                                                                ) : (
                                                                    <TbLayoutBottombarCollapse />
                                                                )}
                                                            </IconButton>
                                                            <Field
                                                                name={`${segmentsArray.name}.${segmentIndex()}.id`}
                                                                type="string"
                                                            >
                                                                {(field) => <input value={field.value} hidden />}
                                                            </Field>
                                                            <Field
                                                                name={`${segmentsArray.name}.${segmentIndex()}.name`}
                                                            >
                                                                {(field, props) => (
                                                                    <Stack justifyContent="center" width="100%">
                                                                        <input
                                                                            type="text"
                                                                            class="!bg-gray-600 outline-none focus:border-b-2 font-[inherit] w-full"
                                                                            placeholder="Nome do segmento"
                                                                            {...props}
                                                                            onFocus={() => setOpen(true)}
                                                                            // @ts-expect-error
                                                                            value={field.value}
                                                                        />
                                                                        {!!field.error && (
                                                                            <FormHelperText error>
                                                                                {field.error}
                                                                            </FormHelperText>
                                                                        )}
                                                                    </Stack>
                                                                )}
                                                            </Field>

                                                            <IconButton
                                                                disabled={segmentIndex() <= 0}
                                                                onClick={() =>
                                                                    swap(form, 'segments', {
                                                                        at: segmentIndex(),
                                                                        and: segmentIndex() - 1,
                                                                    })
                                                                }
                                                            >
                                                                <FiChevronUp />
                                                            </IconButton>
                                                            <IconButton
                                                                disabled={
                                                                    segmentIndex() >= segmentsArray.items.length - 1
                                                                }
                                                                onClick={() =>
                                                                    swap(form, 'segments', {
                                                                        at: segmentIndex(),
                                                                        and: segmentIndex() + 1,
                                                                    })
                                                                }
                                                            >
                                                                <FiChevronDown />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() =>
                                                                    remove(form, 'segments', { at: segmentIndex() })
                                                                }
                                                            >
                                                                <FiTrash />
                                                            </IconButton>
                                                        </Stack>
                                                        <div
                                                            class="segment"
                                                            classList={{ hiddenSegment: !displayContent() }}
                                                        >
                                                            <FieldArray
                                                                name={`${
                                                                    segmentsArray.name
                                                                }.${segmentIndex()}.sessions`}
                                                            >
                                                                {(sessionArray) => (
                                                                    <Stack gap={1}>
                                                                        <Stack gap={2}>
                                                                            <For each={sessionArray.items}>
                                                                                {(_, index) => (
                                                                                    <SessionForm
                                                                                        form={form}
                                                                                        fieldArray={sessionArray}
                                                                                        index={index()}
                                                                                    />
                                                                                )}
                                                                            </For>
                                                                        </Stack>
                                                                        {!!sessionArray.error && (
                                                                            <FormHelperText error>
                                                                                Insira ao menos 1 sessão
                                                                            </FormHelperText>
                                                                        )}
                                                                        <Stack alignItems="center">
                                                                            <IconButton
                                                                                disabled={loading()}
                                                                                onClick={() =>
                                                                                    insert(form, sessionArray.name, {
                                                                                        at: sessionArray.items.length,
                                                                                        value: createEmptySession(),
                                                                                    })
                                                                                }
                                                                            >
                                                                                <FiPlus title="Nova sessão" />
                                                                            </IconButton>
                                                                        </Stack>
                                                                    </Stack>
                                                                )}
                                                            </FieldArray>
                                                        </div>
                                                    </Stack>
                                                )
                                            }}
                                        </For>
                                        {!!segmentsArray.error && (
                                            <FormHelperText error>Insira ao menos 1 segmento</FormHelperText>
                                        )}
                                        <Button
                                            disabled={loading()}
                                            onClick={() =>
                                                insert(form, 'segments', {
                                                    at: segmentsArray.items.length,
                                                    value: createEmptySegment(),
                                                })
                                            }
                                            class="self-center"
                                            variant="contained"
                                            color="secondary"
                                        >
                                            Novo Segmento
                                        </Button>
                                    </>
                                )}
                            </FieldArray>
                        </Stack>
                    </Container>
                </Box>
            </div>
        </Form>
    )
}

export default ProgramForm

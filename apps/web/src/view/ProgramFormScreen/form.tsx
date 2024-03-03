import { IProgramInput } from 'goal-models'
import { FiPlus, FiTrash } from 'solid-icons/fi'

import { Component, For, createSignal } from 'solid-js'

import ActivityIndicator from '@components/ActivityIndicator'
import TextInput from '@components/TextInput'
import { SubmitHandler, createForm, insert, remove, setValue, zodForm } from '@modular-forms/solid'
import { useNavigate } from '@solidjs/router'
import {
    Box,
    Button,
    Container,
    Drawer,
    FormControl,
    FormHelperText,
    IconButton,
    MenuItem,
    Select,
    Stack,
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

    return (
        <Form onSubmit={handleSubmit}>
            <Drawer
                sx={{ [`& .MuiDrawer-paper`]: { width: '500px', boxSizing: 'border-box', marginTop: '80px' } }}
                variant="permanent"
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
                                <label class="text-sm">Tipo de bloqueio</label>

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
            <Box style={{ 'padding-left': '500px' }}>
                <Container maxWidth="md">
                    <Stack py={2} gap={2}>
                        <FieldArray name="segments">
                            {(segmentsArray) => (
                                <>
                                    <For each={segmentsArray.items}>
                                        {(_, segmentIndex) => (
                                            <Stack py={2} gap={2}>
                                                <Stack direction="row">
                                                    <IconButton
                                                        onClick={() => remove(form, 'segments', { at: segmentIndex() })}
                                                    >
                                                        <FiTrash />
                                                    </IconButton>
                                                    <Field
                                                        name={`${segmentsArray.name}.${segmentIndex()}.id`}
                                                        type="string"
                                                    >
                                                        {(field) => <input value={field.value} hidden />}
                                                    </Field>
                                                    <Field name={`${segmentsArray.name}.${segmentIndex()}.name`}>
                                                        {(field, props) => (
                                                            <Stack justifyContent="center" width="100%">
                                                                <input
                                                                    type="text"
                                                                    class="!bg-gray-600 outline-none focus:border-b-2 font-[inherit] w-full"
                                                                    placeholder="Nome do segmento"
                                                                    {...props}
                                                                    // @ts-expect-error
                                                                    value={field.value}
                                                                />
                                                                {!!field.error && (
                                                                    <FormHelperText error>{field.error}</FormHelperText>
                                                                )}
                                                            </Stack>
                                                        )}
                                                    </Field>
                                                </Stack>
                                                <FieldArray name={`${segmentsArray.name}.${segmentIndex()}.sessions`}>
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
                                            </Stack>
                                        )}
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
        </Form>
    )
}

export default ProgramForm

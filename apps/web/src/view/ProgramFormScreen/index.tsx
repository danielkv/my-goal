import { FiPlus, FiTrash } from 'solid-icons/fi'

import { Component, For } from 'solid-js'

import DashboardContainer from '@components/DashboardContainer'
import TextInput from '@components/TextInput'
import { SubmitHandler, createForm, insert, remove, setValue, zodForm } from '@modular-forms/solid'
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

import { TProgramForm, createEmptyProgram, createEmptySegment, createEmptySession, programFormSchema } from './config'
import SessionForm from './sessionForm'

const ProgramFormScreen: Component = () => {
    const [form, { Form, Field, FieldArray }] = createForm<TProgramForm>({
        initialValues: createEmptyProgram(),
        // @ts-expect-error
        validate: zodForm(programFormSchema),
    })

    const handleSubmit: SubmitHandler<TProgramForm> = async (result) => {
        try {
            await saveProgramUseCase(result)
        } catch (err) {
            alert(getErrorMessage(err))
        }
    }

    return (
        <DashboardContainer>
            <Form onSubmit={handleSubmit}>
                <Drawer
                    sx={{ [`& .MuiDrawer-paper`]: { width: '500px', boxSizing: 'border-box', marginTop: '80px' } }}
                    variant="permanent"
                >
                    <Stack gap={3} p={3}>
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
                            {(field, props) => {
                                return (
                                    <FormControl variant="outlined" size="small">
                                        <label class="text-sm">Tipo de bloqueio</label>
                                        {/* @ts-expect-error */}
                                        <Select
                                            error={!!field.error}
                                            style={{
                                                'background-color': 'white',
                                                'border-radius': '0.375rem',
                                                color: '#333',
                                                height: '35px',
                                            }}
                                            sx={{ ['& .MuiSelect-icon']: { color: 'black' } }}
                                            {...props}
                                        >
                                            <MenuItem value="none" selected={field.value === 'none'}>
                                                Sem bloqueio
                                            </MenuItem>
                                            <MenuItem value="weekly" selected={field.value === 'weekly'}>
                                                1 semana
                                            </MenuItem>
                                            <MenuItem value="monthly" selected={field.value === 'monthly'}>
                                                1 mês
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                )
                            }}
                        </Field>
                        <Stack direction="row" gap={3} justifyContent="flex-end">
                            <Button color="secondary" variant="contained">
                                Cancelar
                            </Button>
                            <Button variant="contained" type="submit">
                                Salvar
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
                                                            onClick={() =>
                                                                remove(form, 'segments', { at: segmentIndex() })
                                                            }
                                                        >
                                                            <FiTrash />
                                                        </IconButton>
                                                        <Field name={`${segmentsArray.name}.${segmentIndex()}.name`}>
                                                            {(field, props) => (
                                                                <Stack justifyContent="center" width="100%">
                                                                    <input
                                                                        type="text"
                                                                        class="!bg-gray-600 outline-none focus:border-b-2 font-[inherit] w-full"
                                                                        {...props}
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
                                                    </Stack>
                                                    <FieldArray
                                                        name={`${segmentsArray.name}.${segmentIndex()}.sessions`}
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
        </DashboardContainer>
    )
}

export default ProgramFormScreen

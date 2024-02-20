import { FiTrash } from 'solid-icons/fi'

import { Component, For } from 'solid-js'

import DashboardContainer from '@components/DashboardContainer'
import TextInput from '@components/TextInput'
import { SubmitHandler, createForm, insert, remove } from '@modular-forms/solid'
import { Box, Button, Container, Drawer, FormControl, IconButton, MenuItem, Select, Stack } from '@suid/material'

import { TProgramForm, programInitialValues } from './config'
import SessionForm from './sessionForm'

const ProgramFormScreen: Component = () => {
    const [form, { Form, Field, FieldArray }] = createForm<TProgramForm>({ initialValues: programInitialValues })

    const handleSubmit: SubmitHandler<TProgramForm> = (result) => {
        console.log(result)
    }

    return (
        <DashboardContainer>
            <Form onSubmit={handleSubmit}>
                <Drawer
                    sx={{ [`& .MuiDrawer-paper`]: { width: '500px', boxSizing: 'border-box', marginTop: '80px' } }}
                    variant="permanent"
                >
                    <Stack gap={3} p={3}>
                        <Field name="name">{(_, props) => <TextInput {...props} label="Nome" />}</Field>
                        <Field type="number" name="amount">
                            {(_, props) => <TextInput {...props} label="Valor" />}
                        </Field>
                        <Field type="number" name="expiration">
                            {(_, props) => <TextInput {...props} label="Expira em" type="number" />}
                        </Field>
                        <Field name="block_segments">
                            {(_, props) => (
                                <FormControl variant="outlined" size="small">
                                    <label class="text-sm">Tipo de bloqueio</label>
                                    <Select
                                        {...props}
                                        style={{
                                            'background-color': 'white',
                                            'border-radius': '0.375rem',
                                            color: '#333',
                                            height: '35px',
                                        }}
                                        sx={{ ['& .MuiSelect-icon']: { color: 'black' } }}
                                        value="weekly"
                                    >
                                        <MenuItem value="none">Sem bloqueio</MenuItem>
                                        <MenuItem value="weekly">1 semana</MenuItem>
                                        <MenuItem value="monthly">1 mês</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
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
                        <Stack py={3} gap={3}>
                            <FieldArray name="segments">
                                {(segmentsArray) => (
                                    <>
                                        <For each={segmentsArray.items}>
                                            {(_, segmentIndex) => (
                                                <Stack py={3} gap={3}>
                                                    <Stack direction="row">
                                                        <IconButton
                                                            onClick={() =>
                                                                remove(form, 'segments', { at: segmentIndex() })
                                                            }
                                                        >
                                                            <FiTrash />
                                                        </IconButton>
                                                        <input
                                                            type="text"
                                                            name="segmentName"
                                                            class="!bg-gray-600 outline-none focus:border-b-2 font-[inherit] w-full"
                                                            value="Semana 1"
                                                        />
                                                    </Stack>
                                                    <FieldArray
                                                        name={`${segmentsArray.name}.${segmentIndex()}.sessions`}
                                                    >
                                                        {(fieldArray) => (
                                                            <For each={fieldArray.items}>
                                                                {(_, index) => (
                                                                    <SessionForm
                                                                        form={form}
                                                                        fieldArray={fieldArray}
                                                                        index={index()}
                                                                    />
                                                                )}
                                                            </For>
                                                        )}
                                                    </FieldArray>
                                                </Stack>
                                            )}
                                        </For>
                                        <Button
                                            onClick={() =>
                                                insert(form, 'segments', {
                                                    at: 0,

                                                    value: {
                                                        created_at: '',
                                                        id: '',
                                                        program_id: '',
                                                        name: '',
                                                        sessions: [
                                                            {
                                                                name: '',
                                                                created_at: '',
                                                                id: '',
                                                                segment_id: '',
                                                                classes: [
                                                                    {
                                                                        name: 'asd',
                                                                        id: 'asd',
                                                                        created_at: '',
                                                                        session_id: '',
                                                                        text: '',
                                                                        video: '',
                                                                    },
                                                                ],
                                                            },
                                                        ],
                                                    },
                                                })
                                            }
                                            class="self-center"
                                            variant="contained"
                                            color="secondary"
                                        >
                                            Adicionar Segmento
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

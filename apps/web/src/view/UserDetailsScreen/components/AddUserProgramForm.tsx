import { Component, For, Show, createResource, createSignal } from 'solid-js'

import ActivityIndicator from '@components/ActivityIndicator'
import TextInput from '@components/TextInput'
import { SubmitHandler, createForm, setValue, zodForm } from '@modular-forms/solid'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    MenuItem,
    Select,
    Stack,
} from '@suid/material'
import { listProgramsUseCase } from '@useCases/programs/listPrograms'
import { sellUserProgram } from '@useCases/programs/sellUserProgram'
import { getErrorMessage } from '@utils/errors'

import { TUserProgramForm, userProgramFormSchema } from './config'

interface AddUserProgramFormProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void | Promise<void>
    userId: string
}

const AddUserProgramForm: Component<AddUserProgramFormProps> = (props) => {
    const [form, { Form, Field }] = createForm({ validate: zodForm(userProgramFormSchema) })
    const [loading, setLoading] = createSignal(false)

    const [programs] = createResource(
        () => ['programList', props.userId] || null,
        () => listProgramsUseCase({ pageSize: 100, sortBy: 'name' })
    )

    const handleSubmit: SubmitHandler<TUserProgramForm> = async (result) => {
        try {
            setLoading(true)
            await sellUserProgram({ ...result, user_id: props.userId })

            props.onSuccess?.()
            props.onClose()
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <Form onSubmit={handleSubmit}>
                <DialogTitle id="alert-dialog-title">Vender programa para usuário</DialogTitle>
                <DialogContent class="w-96 max-w-[100%]">
                    <Stack gap={2}>
                        <Field name="program_id">
                            {(field) => (
                                <Show when={programs()?.items}>
                                    {(items) => (
                                        <FormControl variant="outlined" size="small">
                                            <FormLabel class="!text-sm">Tipo de bloqueio</FormLabel>
                                            <Select
                                                value={field.value}
                                                error={!!field.error}
                                                style={{
                                                    'background-color': 'white',
                                                    'border-radius': '0.375rem',
                                                    color: '#333',
                                                    height: '35px',
                                                }}
                                                sx={{ ['& .MuiSelect-icon']: { color: 'black' } }}
                                                onChange={(e) => {
                                                    setValue(form, 'program_id', e.target.value)
                                                }}
                                            >
                                                <For each={items()}>
                                                    {(item) => <MenuItem value={item.id}>{item.name}</MenuItem>}
                                                </For>
                                            </Select>
                                        </FormControl>
                                    )}
                                </Show>
                            )}
                        </Field>
                        <Field type="number" name="paid_amount">
                            {(field, props) => (
                                <TextInput
                                    {...props}
                                    label="Valor pago"
                                    type="number"
                                    error={field.error}
                                    value={field.value || ''}
                                />
                            )}
                        </Field>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="secondary" onClick={props.onClose} disabled={loading()}>
                        Cancelar
                    </Button>
                    <Button variant="contained" type="submit" disabled={loading()}>
                        {loading() ? <ActivityIndicator color="#fff" size={24} /> : 'Vender'}
                    </Button>
                </DialogActions>
            </Form>
        </Dialog>
    )
}

export default AddUserProgramForm

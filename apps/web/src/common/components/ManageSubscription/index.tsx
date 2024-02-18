import { PromotionalPeriod, availableSubscriptions, mappedPromotionalPeriod, mappedSubscriptions } from 'goal-utils'

import { Component, For, createMemo, createSignal } from 'solid-js'

import ActivityIndicator from '@components/ActivityIndicator'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@suid/material'
import { grantPromotionalEntitlementUseCase } from '@useCases/subscriptions/grantPromtionalEntitlement'
import { getErrorMessage } from '@utils/errors'

interface ManageSubscriptionProps {
    open: boolean
    app_user_id: string | string[]
    onClose: () => void
    onSuccess?: () => void | Promise<void>

    current?: keyof typeof availableSubscriptions | 'none'
}

const ManageSubscription: Component<ManageSubscriptionProps> = (props) => {
    const [loading, setLoading] = createSignal(false)
    const [selectedSubscription, setSelectedSubscription] = createSignal(props.current || 'none')
    const [selectedDuration, setSelectedDuration] = createSignal<PromotionalPeriod>('monthly')

    const handleSubmit = async () => {
        try {
            const subscription = selectedSubscription()
            if (!Object.keys(availableSubscriptions).includes(subscription)) throw new Error('Assinatura inexistente')

            setLoading(true)
            await grantPromotionalEntitlementUseCase(
                props.app_user_id,
                availableSubscriptions[subscription as keyof typeof availableSubscriptions],
                selectedDuration()
            )
            await Promise.resolve(props.onSuccess?.())
            props.onClose()
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setLoading(false)
        }
    }

    const buttonDisabled = createMemo(() => {
        return loading() || selectedSubscription() === 'none' || selectedDuration() === ('' as any)
    })

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Editar assinatura (promocional)</DialogTitle>
            <DialogContent class="w-96 max-w-[100%]">
                <Stack gap={2}>
                    <select class="input input-full" onChange={(e) => setSelectedSubscription(e.target.value as any)}>
                        <option value="none">Não atribuir nenhuma assinatura</option>
                        <For each={Object.entries(mappedSubscriptions)}>
                            {([key, label]) => (
                                <option value={key} selected={selectedSubscription() === key}>
                                    {label}
                                </option>
                            )}
                        </For>
                    </select>
                    <select
                        class="input input-full"
                        onChange={(e) => setSelectedDuration(e.target.value as PromotionalPeriod)}
                    >
                        <option value="">Duração</option>
                        <For each={Object.entries(mappedPromotionalPeriod)}>
                            {([key, label]) => (
                                <option value={key} selected={selectedDuration() === key}>
                                    {label}
                                </option>
                            )}
                        </For>
                    </select>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="secondary" onClick={props.onClose} disabled={loading()}>
                    Cancelar
                </Button>
                <Button variant="contained" onClick={handleSubmit} disabled={buttonDisabled()}>
                    {loading() ? <ActivityIndicator color="#fff" size={24} /> : 'Atribuir'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ManageSubscription

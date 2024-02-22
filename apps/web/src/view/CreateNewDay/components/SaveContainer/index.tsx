import cloneDeep from 'clone-deep'
import { IWorksheetInput } from 'goal-models'
import { omit } from 'radash'

import { Component, Setter, createSignal } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'

import { useNavigate } from '@solidjs/router'
import { Button } from '@suid/material'
import { removeTempWorksheetUseCase } from '@useCases/temp-worksheet/removeTempWorksheet'
import { saveWorksheetUseCase } from '@useCases/worksheet/saveWorksheet'
import { getErrorMessage } from '@utils/errors'

interface ISaveContainerProps {
    worksheet: IWorksheetInput
    handleSetWorksheet: SetStoreFunction<IWorksheetInput>
    handleSetLastTempSaved: Setter<IWorksheetInput>
}

const SaveContainer: Component<ISaveContainerProps> = (props) => {
    const [saving, setSaving] = createSignal(false)
    const [duplicating, setDuplicating] = createSignal(false)
    const navigate = useNavigate()

    const handleClickSaveButton = async () => {
        if (props.worksheet.published) {
            if (
                !confirm(
                    'Essa planilha está publicada, caso salvar todas as modificações serão visíveis imediatamente para os usuários. Deseja continuar?'
                )
            )
                return
        }

        try {
            setSaving(true)
            const result = await saveWorksheetUseCase(props.worksheet)
            if (props.worksheet.id) await removeTempWorksheetUseCase(props.worksheet.id)

            props.handleSetLastTempSaved(result)
            props.handleSetWorksheet(result)

            navigate(`/dashboard/worksheet/${result.id}`)
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setSaving(false)
        }
    }

    const handleClickDuplicateButton = async () => {
        if (!confirm('Deseja duplicar essa planilha?')) return

        try {
            setDuplicating(true)
            const duplicated = omit(cloneDeep(props.worksheet), ['id', 'published'])
            duplicated.days = duplicated.days.map((day) => omit(day, ['id']))
            duplicated.name = `Cópia de ${duplicated.name}`

            const result = await saveWorksheetUseCase(duplicated)

            navigate(`/dashboard/worksheet/${result.id}`)
        } catch (err) {
            alert(getErrorMessage(err))
        } finally {
            setDuplicating(false)
        }
    }

    return (
        <div class="paper flex flex-row justify-center gap-6 rounded-none fixed bottom-0 left-0 right-0">
            <Button variant="contained" onClick={handleClickSaveButton} disabled={duplicating() || saving()}>
                {saving() ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleClickDuplicateButton}
                disabled={duplicating() || saving()}
            >
                {duplicating() ? 'Duplicando...' : 'Duplicar'}
            </Button>
        </div>
    )
}

export default SaveContainer

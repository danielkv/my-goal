import { ISection, TPeaces } from 'goal-models'
import { sectionTransformer } from 'goal-utils'

import { Component, JSX, createEffect, createSignal, onMount } from 'solid-js'

import { Path } from '@interfaces/app'
import { getErrorMessage } from '@utils/errors'

export interface SectionEditorProps {
    onUpdate?(path: Path, newValue: TPeaces): void
    onClose(): void
    thisPath: Path
    current: ISection
}

const SectionEditor: Component<SectionEditorProps> = (props) => {
    const [text, setText] = createSignal(sectionTransformer.toString(props.current.blocks))
    const editorId = props.thisPath.replaceAll('.', '-')

    createEffect(() => {
        setText(sectionTransformer.toString(props.current.blocks))
    })

    const updateForm = () => {
        try {
            const text: string = (document.querySelector(`#${editorId} .section-editor`) as any).value
            if (!text) return

            const blocks = sectionTransformer.toObject(text)

            const section: ISection = {
                ...props.current,
                blocks,
            }

            props.onUpdate?.(props.thisPath, section)

            props.onClose()
        } catch (err) {
            alert(getErrorMessage(err))
        }
    }

    const handleUpdate: JSX.CustomEventHandlersCamelCase<HTMLFormElement>['onSubmit'] = (e) => {
        e.preventDefault()

        updateForm()
    }
    onMount(() => {
        const element = document.querySelector(`#${editorId} .section-editor`) as HTMLInputElement
        element.focus()
    })

    const handleKeyDown: JSX.CustomEventHandlersCamelCase<HTMLTextAreaElement>['onKeyDown'] = (e) => {
        switch (e.key) {
            case 'Enter': {
                if (!e.ctrlKey) return
                e.preventDefault()
                return updateForm()
            }
            case 'Escape': {
                e.preventDefault()
                return props.onClose()
            }
        }
    }

    return (
        <form onSubmit={handleUpdate} class="flex w-full flex-col" id={editorId}>
            <textarea
                onKeyDown={handleKeyDown}
                class="section-editor  bg-[transparent] text-sm  border-none outline-none bg-gray-800 rounded-xl p-3 m-2"
                rows={15}
            >
                {text()}
            </textarea>
            <div class="flex mx-2 gap-3 justify-end">
                <button class="btn btn-light" onClick={props.onClose}>
                    Cancelar
                </button>
                <button type="submit" class="btn btn-main">
                    Aplicar
                </button>
            </div>
        </form>
    )
}

export default SectionEditor

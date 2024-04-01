import { createEditorTransaction } from 'solid-tiptap'
import { EditorContent, createEditor } from 'tiptap-solid'

import { Component, Show } from 'solid-js'

import EditorMenu from '@components/EditorMenu'
import { Field, getValue, setValue } from '@modular-forms/solid'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { MentionMovement } from '@utils/editor/movement'
import { WeightPercent } from '@utils/editor/percentWeight'
import { TimerNode } from '@utils/editor/timerNode'
import PeaceControl from '@view/NewWorksheet/components/PeaceControl'
import { IWorksheetArrayFormCommon } from '@view/NewWorksheet/types'

import styles from '../../styles.module.css'

export interface BlockProps
    extends IWorksheetArrayFormCommon<`days.${number}.periods.${number}.sections.${number}.blocks`> {}

const BlockPeace: Component<BlockProps> = (props) => {
    const editor = createEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2], HTMLAttributes: { class: 'editor-heading' } },
                bulletList: { keepMarks: true, HTMLAttributes: { class: 'editor-list' } },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right'],
            }),
            Underline,
            MentionMovement,
            WeightPercent,
            TimerNode,
        ],
        onUpdate({ editor }) {
            setValue(props.form, `${props.arrProps.name}.${props.index}.text`, editor.getHTML())
        },
        content: getValue(props.form, `${props.arrProps.name}.${props.index}.text`),
    })

    const isFocused = createEditorTransaction(
        () => editor()!,
        (editor) => editor?.isFocused || false
    )

    return (
        <div
            id="parent"
            class={`block selectable rounded-xl p-2 ${styles['block-editor']}`}
            classList={{ selected: props.selectedPath === `${props.arrProps.name}.${props.index}` }}
            onClick={(e) => {
                e.stopPropagation()
                props.setSelectedPath(`${props.arrProps.name}.${props.index}`)
            }}
        >
            <PeaceControl
                selectedPath={props.selectedPath}
                setSelectedPath={props.setSelectedPath}
                arrProps={props.arrProps}
                form={props.form}
                index={props.index}
            />
            <EditorContent editor={editor()}></EditorContent>
            <Field of={props.form} type="boolean" name={`${props.arrProps.name}.${props.index}.v2`}>
                {() => <input value="" hidden />}
            </Field>
            <Field of={props.form} name={`${props.arrProps.name}.${props.index}.text`}>
                {() => (
                    <Show when={editor()}>
                        {(notNullEditor) => (
                            <Show when={isFocused()}>
                                <EditorMenu editor={notNullEditor()} />
                            </Show>
                        )}
                    </Show>
                )}
            </Field>
        </div>
    )
}

export default BlockPeace

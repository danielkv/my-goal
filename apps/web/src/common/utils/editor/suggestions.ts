import tippy, { Instance } from 'tippy.js'
import { SolidRenderer } from 'tiptap-solid'

import { mergeProps } from 'solid-js'

import { EditorMenuList, EditorMenuListProps, EditorMenuListRef } from '@components/EditorMentionList'
import { SuggestionOptions } from '@tiptap/suggestion'

export const suggestion: Omit<SuggestionOptions, 'editor'> = {
    allowSpaces: true,
    items: () => [],
    render: () => {
        let component: SolidRenderer<EditorMenuListProps>
        let popup: Instance[]
        let menuRef: EditorMenuListRef

        return {
            onStart(props) {
                const allProps = mergeProps(props, {
                    updateHandler: (handlers: EditorMenuListRef) => {
                        menuRef = handlers
                    },
                })
                component = new SolidRenderer(EditorMenuList, {
                    editor: props.editor,
                    props: allProps,
                })
                if (!props.clientRect) {
                    return
                }

                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect as () => DOMRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                })
            },
            onUpdate(props) {
                component.updateProps(props)

                if (!props.clientRect) {
                    return
                }

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect as () => DOMRect,
                })
            },
            onKeyDown(props) {
                return menuRef.onKeyDown(props)
            },
            onExit() {
                popup[0].destroy()
                component.destroy()
            },
        }
    },
}

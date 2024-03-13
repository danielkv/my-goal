import { PluginKey } from 'prosemirror-state'

import { mergeAttributes } from '@tiptap/core'
import Mention from '@tiptap/extension-mention'

import { movementSuggestion } from './movement-suggestion'

export const MentionMovement = Mention.extend({
    name: 'mention-movement',
    addAttributes() {
        return {
            id: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-id'),
                renderHTML: (attributes) => {
                    if (!attributes.id) return {}

                    return {
                        'data-id': attributes.id,
                    }
                },
            },
            label: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-label'),
                renderHTML: (attributes) => {
                    if (!attributes.label) return {}

                    return {
                        'data-label': attributes.label,
                    }
                },
            },
        }
    },

    renderHTML({ node, HTMLAttributes }) {
        const outputText: string = `${this.options.suggestion.char}${node.attrs.label}`

        return [
            'span',
            mergeAttributes(this.options.HTMLAttributes, { 'data-type': this.name }, HTMLAttributes),
            outputText,
        ]
    },
}).configure({
    HTMLAttributes: {
        class: 'mention-movement',
    },
    suggestion: {
        ...movementSuggestion,
        pluginKey: new PluginKey('mention-movement'),
    },
})

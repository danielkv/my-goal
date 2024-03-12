import { PluginKey } from 'prosemirror-state'

import { escapeForRegEx, mergeAttributes } from '@tiptap/core'
import Mention from '@tiptap/extension-mention'

import { suggestion } from './suggestions'

export const WeightPercent = Mention.extend({
    name: 'weightPercent',

    addAttributes() {
        return {
            id: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-id'),
                renderHTML(attr) {
                    if (!attr.id) return {}

                    return {
                        'data-id': attr.id,
                    }
                },
            },
            label: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-label'),
                renderHTML(attr) {
                    if (!attr.label) return {}

                    return {
                        'data-label': attr.label,
                    }
                },
            },
            percentage: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-percentage'),
                renderHTML(attr) {
                    if (!attr.percentage) return {}

                    return {
                        'data-percentage': attr.percentage,
                    }
                },
            },
        }
    },
    parseHTML() {
        return [
            {
                tag: `span[data-type="${this.name}"]`,
            },
        ]
    },

    renderHTML({ node, HTMLAttributes }) {
        const outputText = `${node.attrs.percentage}${this.options.suggestion.char}${node.attrs.label}`

        return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), outputText]
    },

    renderText({ node }) {
        return `${this.options.suggestion.char}${node.attrs.label}`
    },
}).configure({
    HTMLAttributes: {
        class: 'weight-pct',
    },
    suggestion: {
        ...suggestion,
        pluginKey: new PluginKey('weightPercent'),
        char: '%',

        findSuggestionMatch(config) {
            const { char, allowedPrefixes, startOfLine, $position } = config

            const escapedChar = escapeForRegEx(char)
            const suffix = new RegExp(`\\s${escapedChar}$`)
            const prefix = startOfLine ? '^' : ''
            const regexp = new RegExp(`${prefix}(?<pct>\\d+)${escapedChar}.*?(?=\\s${escapedChar}|$)`, 'gm')

            const text = $position.nodeBefore?.isText && $position.nodeBefore.text

            if (!text) {
                return null
            }

            const textFrom = $position.pos - text.length
            const match = Array.from(text.matchAll(regexp)).pop()

            if (!match || match.input === undefined || match.index === undefined || !match.groups?.pct) {
                return null
            }

            // JavaScript doesn't have lookbehinds. This hacks a check that first character
            // is a space or the start of the line
            const matchPrefix = match.input.slice(Math.max(0, match.index - 1), match.index)
            const matchPrefixIsAllowed = new RegExp(`^[${allowedPrefixes?.join('')}\0]?$`).test(matchPrefix)

            if (allowedPrefixes !== null && !matchPrefixIsAllowed) {
                return null
            }

            // The absolute position of the match in the document
            const from = textFrom + match.index
            let to = from + match[0].length

            // Edge case handling; if spaces are allowed and we're directly in between
            // two triggers
            if (suffix.test(text.slice(to - 1, to + 1))) {
                match[0] += ' '
                to += 1
            }

            // If the $position is located within the matched substring, return that range
            if (from < $position.pos && to >= $position.pos) {
                return {
                    range: {
                        from,
                        to,
                    },
                    query: match[0].slice(char.length + match.groups.pct.length),
                    text: match[0],
                }
            }

            return null
        },
        command: ({ editor, range, props }) => {
            // increase range.to by one when the next node is of type "text"
            // and starts with a space character
            const nodeAfter = editor.view.state.selection.$to.nodeAfter
            const overrideSpace = nodeAfter?.text?.startsWith(' ')

            const escapedChar = escapeForRegEx('%')
            const regexp = new RegExp(`(?<pct>\\d+)${escapedChar}.*?(?=\\s${escapedChar}|$)`, 'gm')

            const nodeBefore = editor.state.selection.$from.nodeBefore
            const text = nodeBefore?.isText && nodeBefore.text
            if (!text) return

            const match = Array.from(text.matchAll(regexp)).pop()
            if (!match?.groups?.pct) return

            if (overrideSpace) {
                range.to += 1
            }

            props.percentage = Number(match.groups.pct)

            editor
                .chain()
                .focus()
                .insertContentAt(range, [
                    {
                        type: 'weightPercent',
                        attrs: props,
                    },
                    {
                        type: 'text',
                        text: ' ',
                    },
                ])
                .run()

            window.getSelection()?.collapseToEnd()
        },
    },
})

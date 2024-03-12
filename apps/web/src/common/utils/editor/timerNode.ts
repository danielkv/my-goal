import { TTimer, TTimerTypes } from 'goal-models'
import { BaseDisplay, BaseTransformer } from 'goal-utils'
import { omit } from 'radash'

import { Editor, Node, Range, escapeForRegEx } from '@tiptap/core'

const transformer = new BaseTransformer()
const display = new BaseDisplay()

type ResolvedTime = Omit<TTimer, 'type'> & {
    timertype: TTimerTypes
    range: Range
}

interface TimerOptions {
    char: string
    getResolvedTime(editor: Editor, char: string): ResolvedTime | null
    render(editor: Editor, timeInfo: ResolvedTime): void
}

export const TimerNode = Node.create<TimerOptions>({
    name: 'timer',
    group: 'inline',
    selectable: false,
    atom: true,
    inline: true,
    addOptions() {
        const name = this.name
        return {
            char: '$',
            getResolvedTime(editor, char) {
                const { selection } = editor.state

                const { nodeBefore, pos: cursorPosition } = selection.$from

                const escapedChar = escapeForRegEx(char)
                const nodeText = nodeBefore?.isText && nodeBefore?.text
                if (!nodeText) return null

                const regexp = new RegExp(`${escapedChar}.*?(?=\\s${escapedChar}|$)`, 'gm')
                const match = Array.from(nodeText.matchAll(regexp)).pop()

                if (!match || match.input === undefined || match.index === undefined) return null

                const firstWhitespacePos = cursorPosition - nodeText.length + match.index
                const lastWhitesacePos = firstWhitespacePos + match[0].length

                const timeText = match[0].slice(char.length)

                const timer = transformer.extractTimerFromString(timeText)
                if (!timer) return null

                return {
                    ...omit(timer, ['reps', 'type']),
                    timertype: timer.type,
                    range: { from: firstWhitespacePos, to: lastWhitesacePos + 1 },
                }
            },

            render(editor, timerInfo) {
                editor
                    .chain()
                    .focus()
                    .insertContentAt(timerInfo.range, [
                        { type: name, attrs: { ...omit(timerInfo, ['range']) } },
                        { type: 'text', text: ' ' },
                    ])
                    .run()
            },
        }
    },

    addAttributes() {
        return {
            timecap: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-timecap'),
                renderHTML(attr) {
                    if (!attr.timecap) return {}

                    return {
                        'data-timecap': attr.timecap,
                    }
                },
            },
            timertype: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-timertype'),
                renderHTML(attr) {
                    if (!attr.timertype) return {}

                    return {
                        'data-timertype': attr.timertype,
                    }
                },
            },
            numberOfRounds: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-numberOfRounds'),
                renderHTML(attr) {
                    if (!attr.numberOfRounds) return {}

                    return {
                        'data-numberOfRounds': attr.numberOfRounds,
                    }
                },
            },
            each: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-each'),
                renderHTML(attr) {
                    if (!attr.each) return {}

                    return {
                        'data-each': attr.each,
                    }
                },
            },
            work: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-work'),
                renderHTML(attr) {
                    if (!attr.work) return {}

                    return {
                        'data-work': attr.work,
                    }
                },
            },
            rest: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-rest'),
                renderHTML(attr) {
                    if (!attr.rest) return {}

                    return {
                        'data-rest': attr.rest,
                    }
                },
            },
        }
    },
    renderHTML({ node, HTMLAttributes }) {
        const text = display.displayTimer({ ...node.attrs, type: node.attrs.timertype } as TTimer)
        if (!text) {
            console.error('Não foi possível fazer o parse do timer')
            return ''
        }

        return ['span', { 'data-type': this.name, class: 'timer', ...HTMLAttributes }, text]
    },

    // renderText({ node }) {
    //     return this.options.renderText({
    //         options: this.options,
    //         node,
    //     })
    // },

    parseHTML() {
        return [
            {
                tag: `span[data-type="${this.name}"]`,
            },
        ]
    },

    addKeyboardShortcuts() {
        const options = this.options

        return {
            Enter(props) {
                const resolved = options.getResolvedTime(props.editor, options.char)
                if (!resolved) return false

                options.render(props.editor, resolved)

                return true
            },
        }
    },
})

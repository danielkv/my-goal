import { ITextBlock } from '@models/block'

export class TextBlockTransformer {
    toObject(text: string): ITextBlock | null {
        const regex = /^(?<text>[A-Za-z].*)$/i

        const match = text.match(regex)
        if (!match?.groups?.text) return null

        return {
            type: 'text',
            text: match.groups.text.trim(),
        }
    }

    toString(obj: ITextBlock): string {
        return obj.text
    }
}

export const textBlockTransformer = new TextBlockTransformer()

import { ITextBlock } from '@models/block'

export class TextBlockDisplay {
    display(obj: ITextBlock) {
        return obj.text
    }
}

export const textBlockDisplay = new TextBlockDisplay()

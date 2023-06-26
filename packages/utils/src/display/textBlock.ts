import { ITextBlock } from 'goal-models'

export class TextBlockDisplay {
    display(obj: ITextBlock) {
        return obj.text
    }
}

export const textBlockDisplay = new TextBlockDisplay()

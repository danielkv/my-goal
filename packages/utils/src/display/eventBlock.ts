import { BaseDisplay } from './base'
import { IEventBlock } from 'goal-models'

export class EventBlockDisplay extends BaseDisplay {
    displayHeader(block: IEventBlock): string {
        const timer = this.displayTimer(block.config) || ''
        const info = block.info && `(${block.info})`

        return this.displayArray([timer, info])
    }
}

export const eventBlockDisplay = new EventBlockDisplay()

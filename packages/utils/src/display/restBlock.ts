import { BaseDisplay } from './base'
import { IRestBlock } from 'goal-models'

export class RestBlockDisplay extends BaseDisplay {
    display(obj: IRestBlock): string {
        return this.displayRest(obj.time)
    }
}

export const restBlockDisplay = new RestBlockDisplay()

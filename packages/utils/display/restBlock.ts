import { IRestBlock } from '@models/block'

import { BaseDisplay } from './base'

export class RestBlockDisplay extends BaseDisplay {
    display(obj: IRestBlock): string {
        return this.displayRest(obj.time)
    }
}

export const restBlockDisplay = new RestBlockDisplay()

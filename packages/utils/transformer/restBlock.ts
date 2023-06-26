import { IRestBlock } from '@models/block'
import { getTimeFromSeconds } from '@utils/time'

import { BaseTransformer } from './base'

export class RestBlockTransformer extends BaseTransformer {
    toObject(text: string): IRestBlock | null {
        const time = this.findRest(text)
        if (!time) return null

        const regex = /\s\-\s(?<text>[a-zA-Z\u00C0-\u00FF\s\'\d\+]+)$/
        const restTextMatch = text.match(regex)

        return {
            type: 'rest',
            time,
            text: restTextMatch?.groups?.text || '',
        }
    }

    toString(obj: IRestBlock): string {
        const time = getTimeFromSeconds(obj.time)

        return this.arrayToString([`${time} Rest`, obj.text])
    }
}

export const restBlockTransformer = new RestBlockTransformer()

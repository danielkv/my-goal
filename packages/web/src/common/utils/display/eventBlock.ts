import deepEqual from 'deep-equal'
import { omit } from 'radash'

import { IEventBlock } from '@models/block'
import { TMergedTimer } from '@models/time'

import { BaseDisplay } from './base'

export class EventBlockDisplay extends BaseDisplay {
    displayHeader(block: IEventBlock, sequence?: string | null): string {
        if (block.event_type === 'max_weight') return ''

        const isSame = sequence
            ? true
            : block.rounds.length > 1 &&
              block.rounds
                  .map((r) => omit(r, ['numberOfRounds']))
                  .every((round) => deepEqual(round, omit(block.rounds[0], ['numberOfRounds'])))

        const _sequence =
            sequence ||
            (isSame
                ? block.rounds
                      .reduce<string[]>((acc, round) => {
                          acc.push(String(round.numberOfRounds))
                          return acc
                      }, [])
                      .join('-')
                : null)

        const timer = this.displayTimer(block.event_type, block as unknown as TMergedTimer, _sequence) || ''
        const info = block.info && `(${block.info})`

        return this.displayArray([timer, info])
    }
}

export const eventBlockDisplay = new EventBlockDisplay()

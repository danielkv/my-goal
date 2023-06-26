import { BaseTransformer } from './base'
import { RoundTransformer, roundTransformer } from './round'
import deepEqual from 'deep-equal'
import { IEventBlock, IRound, TMergedTimer } from 'goal-models'
import { omit } from 'radash'

export class EventBlockTransformer extends BaseTransformer {
    private breakline = '\n\n'
    private blockHeaderRegex = this.mergeRegex(
        ['^bloco', '(?:\\:\\s+', '(?<header>', this.headerRegex, '))?', '(?:\\s*?\\:\\s*?(?<info>.+))?$'],
        'i'
    )
    constructor(private roundTransformer: RoundTransformer) {
        super()
    }

    private extractBlockHeader(text: string) {
        const match = text.match(this.blockHeaderRegex)

        if (!match) return null

        const info = match?.groups?.info?.trim()

        const timer = match?.groups?.header ? super.extractTimerFromString(match.groups.header) : null

        return {
            timer,
            info,
        }
    }

    toObject(text: string): IEventBlock | null {
        const normalizedText = this.normalizeText(text)
        const headerBreak = normalizedText.split('\n')
        if (!headerBreak) return null

        const extractedHeader = this.extractBlockHeader(headerBreak[0].trim())

        if (extractedHeader) {
            headerBreak.splice(0, 1)
            const textRounds = headerBreak.join('\n').split(this.breakline)

            if (!extractedHeader.timer)
                return {
                    type: 'event',
                    info: extractedHeader.info,
                    event_type: 'not_timed',
                    rounds: textRounds.map((t) => this.roundTransformer.toObject(t)).filter((r) => r) as IRound[],
                }

            const roundNumberOfRounds = extractedHeader.timer.reps?.split('-') || null
            const rounds = textRounds
                .flatMap((t) => {
                    if (roundNumberOfRounds)
                        return roundNumberOfRounds.map((numberOfRounds) =>
                            this.roundTransformer.toObject(t, Number(numberOfRounds))
                        )

                    return this.roundTransformer.toObject(t)
                })
                .filter((r) => r) as IRound[]

            return {
                ...omit(extractedHeader.timer, ['reps', 'type', 'numberOfRounds']),
                numberOfRounds: roundNumberOfRounds ? 1 : extractedHeader.timer.numberOfRounds,
                event_type: extractedHeader.timer.type,
                info: extractedHeader.info,
                type: 'event',
                rounds,
            } as IEventBlock
        }

        const textRounds = normalizedText.split(this.breakline)

        if (!textRounds.length) return null
        const rounds = textRounds.map((t) => this.roundTransformer.toObject(t)).filter((r) => r) as IRound[]

        return {
            type: 'event',
            event_type: 'not_timed',
            rounds,
        }
    }

    toString(obj: IEventBlock): string {
        const isSame =
            obj.rounds.length > 1 &&
            obj.rounds
                .map((r) => omit(r, ['numberOfRounds']))
                .every((round) => deepEqual(round, omit(obj.rounds[0], ['numberOfRounds'])))

        const sequence = isSame
            ? obj.rounds
                  .reduce<string[]>((acc, round) => {
                      acc.push(String(round.numberOfRounds))
                      return acc
                  }, [])
                  .join('-')
            : null

        const title = this.headerToString(obj, sequence)

        const rounds = sequence
            ? this.roundTransformer.toString(omit(obj.rounds[0], ['numberOfRounds']) as IRound)
            : obj.rounds.map((o) => this.roundTransformer.toString(o)).join(this.breakline)

        return this.arrayToString([title, rounds], '\n')
    }

    private headerToString(obj: IEventBlock, sequence?: string | null): string | null {
        if (obj.event_type === 'max_weight') return null

        const timerHeader = this.timerToString(obj.event_type, obj as unknown as TMergedTimer, sequence)

        return this.arrayToString([timerHeader, obj.info], ' : ', 'bloco: ')
    }
}

export const eventBlockTransformer = new EventBlockTransformer(roundTransformer)

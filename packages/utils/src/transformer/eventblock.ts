import { isRestRound } from '../models'
import { BaseTransformer } from './base'
import { RoundTransformer, roundTransformer } from './round'
import deepEqual from 'deep-equal'
import { IEventBlock, IRestRound, IRound, TTimer } from 'goal-models'
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
                    config: { type: 'not_timed' },
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
                config: {
                    ...omit(extractedHeader.timer, ['reps', 'numberOfRounds']),
                    numberOfRounds: roundNumberOfRounds ? 1 : extractedHeader.timer.numberOfRounds,
                },
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
            config: { type: 'not_timed' },
            rounds,
        }
    }

    private findBlockSequence(obj: IEventBlock): string | null {
        const roundCompare = obj.rounds[0]
        if (isRestRound(roundCompare)) return null
        if (obj.rounds.some((round) => isRestRound(round))) return null
        if (obj.rounds.length < 2) return null

        const rounds = obj.rounds as Exclude<IRound, IRestRound>[]

        const compare = omit(roundCompare, ['config'])

        const isSame = rounds
            .map((r) => omit(r, ['config']))
            .every((round) => !isRestRound(round) && deepEqual(round, compare))

        if (!isSame) return null

        return rounds
            .reduce<string[]>((acc, round) => {
                acc.push(String(round.config.numberOfRounds))
                return acc
            }, [])
            .join('-')
    }

    toString(obj: IEventBlock): string {
        const sequence = this.findBlockSequence(obj)

        const title = this.headerToString(obj, sequence)

        let roundString: string

        if (sequence) {
            const round = obj.rounds[0] as Exclude<IRound, IRestRound>
            round.config = omit(round.config, ['numberOfRounds']) as TTimer

            roundString = this.roundTransformer.toString(round)
        } else roundString = obj.rounds.map((o) => this.roundTransformer.toString(o)).join(this.breakline)

        return this.arrayToString([title, roundString], '\n')
    }

    private headerToString(obj: IEventBlock, sequence?: string | null): string | null {
        const timerHeader = this.timerToString(obj.config, sequence)

        return this.arrayToString([timerHeader, obj.info], ' : ', 'bloco: ')
    }
}

export const eventBlockTransformer = new EventBlockTransformer(roundTransformer)

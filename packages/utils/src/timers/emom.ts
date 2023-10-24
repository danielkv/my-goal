import { DEFAULT_INTERVAL, ITimerConfig, ITimerEvents, Timer } from './timer'
import { TTimerStatus } from 'goal-models'

type IEmomTimerEvents = ITimerEvents & {
    changeRound(currentRound: number): void
    finishRound(currentRound: number): void
}

export interface IEmomTimerConfig extends Omit<ITimerConfig, 'endTime'> {
    each: number
    rounds: number
    regressive?: boolean
}

export class EmomTimer extends Timer<IEmomTimerEvents> {
    private currentRound = 1
    private regressive = true
    private nextRoundInterval!: NodeJS.Timeout

    constructor(private settings: IEmomTimerConfig) {
        super({ endTime: settings.each, ...settings })
        this.regressive = settings.regressive || true
    }

    getCurrentTime() {
        if (this.regressive) return this.settings.each - this.getTimeElapsed()
        else return this.getTimeElapsed()
    }

    nextRound(emit = true) {
        this.stop('stopped', false)
        this.emit('finishRound', this.currentRound)

        this.nextRoundInterval = setTimeout(() => {
            this.setRound(this.currentRound + 1, emit)
            this.start(0, emit)
        }, this.config?.interval || DEFAULT_INTERVAL)
    }

    start(curentTime?: number | null, emit = true): void {
        if (this.nextRoundInterval) clearTimeout(this.nextRoundInterval)
        super.start(curentTime, emit)
    }

    stop(newStatus?: TTimerStatus, emit?: boolean): void {
        if (this.nextRoundInterval) clearTimeout(this.nextRoundInterval)
        super.stop(newStatus, emit)
    }

    reset(emit = true) {
        if (this.nextRoundInterval) clearTimeout(this.nextRoundInterval)
        this.currentRound = 1
        super.reset(emit)
    }

    setRound(round: number, emit = true) {
        this.currentRound = round
        if (emit) this.emit('changeRound', this.currentRound)
    }

    checkFinished(emit = true): void {
        const timeElapsed = this.getTimeElapsed()

        if (timeElapsed >= this.settings.each) {
            if (this.currentRound >= this.settings.rounds) {
                this.stop('finished', emit)
                if (emit) this.emit('finish')
            } else {
                this.nextRound()
            }
        }
    }
}

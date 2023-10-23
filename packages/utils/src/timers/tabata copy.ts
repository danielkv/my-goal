import { ITimerConfig, ITimerEvents, Timer } from './timer'
import { TActivityStatus, TTimerStatus } from 'goal-models'

type ITabataTimerEvents = ITimerEvents & {
    finish(): void
    changeRound(currentRound: number): void
    changeActivityStatus(activityStatus: TActivityStatus): void
}

export interface ITabataTimerConfig extends Omit<ITimerConfig, 'endTime'> {
    work: number
    rest: number
    rounds: number
    regressive?: boolean
}

export class TabataTimer extends Timer<ITabataTimerEvents> {
    private currentRound = 1
    private activityStatus: TActivityStatus = 'work'
    private regressive = true
    private nextRoundInterval!: NodeJS.Timeout

    constructor(private settings: ITabataTimerConfig) {
        super({
            endTime: settings.work,
            ...settings,
        })

        this.regressive = settings.regressive || true
    }

    getCurrentTime() {
        if (this.endTime && this.regressive) {
            return this.endTime - this.getTimeElapsed()
        } else return this.getTimeElapsed()
    }

    nextRound(emit = true) {
        this.stop('stopped', false)

        this.nextRoundInterval = setTimeout(() => {
            this.setRound(this.currentRound + 1, emit)
            this.setNextActivity(emit)
        }, this.config?.interval || 1000)
    }

    nextActivity(emit = true) {
        this.stop('stopped', false)

        this.nextRoundInterval = setTimeout(() => {
            this.setNextActivity(emit)
        }, this.config?.interval || 1000)
    }

    setNextActivity(emit = true) {
        const isClockWork = this.activityStatus === 'work'
        const newActivity = isClockWork ? 'rest' : 'work'
        const newEndTime = isClockWork ? this.settings.rest : this.settings.work

        this.setActivityStatus(newActivity)
        this.setEndTime(newEndTime)
        this.start(0, emit)
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
        this.setRound(1)
        this.setEndTime(this.settings.work)
        this.setActivityStatus('work')
        super.reset(emit)
    }

    setActivityStatus(newActivity: TActivityStatus, emit = true) {
        this.activityStatus = newActivity
        if (emit) this.emit('changeActivityStatus', this.activityStatus)
    }

    setRound(round: number, emit = true) {
        this.currentRound = round
        if (emit) this.emit('changeRound', this.currentRound)
    }

    checkFinished(emit?: boolean): void {
        const isClockWork = this.activityStatus === 'work'
        const timeElapsed = this.getTimeElapsed()
        const compareTime = isClockWork ? this.settings.work : this.settings.rest

        if (timeElapsed >= compareTime) {
            if (!isClockWork && this.currentRound >= this.settings.rounds) {
                if (emit) this.emit('finish')
                this.stop()
            } else {
                if (!isClockWork) this.nextRound()
                else this.nextActivity()
            }
        }
    }
}

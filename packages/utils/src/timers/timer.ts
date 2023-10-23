import { EventEmitter } from 'events'
import { TTimerRunningType, TTimerStatus } from 'goal-models'
import TypedEmitter, { EventMap } from 'typed-emitter'

export type ICountdownTimerEvents = {
    initialCountdownTick(currentTime: number): void
    finalCountdownTick(currentTime: number): void
    changeRunningType(type: TTimerRunningType): void
}

export interface ICountdownTimerConfig {
    initialCountdown?: number
    endingCountdown?: number
}

export type ITimerEvents = {
    timeElapsed(currentTime: number): void
    start(currentTime: number, status: TTimerStatus): void
    stop(currentTime: number, status: TTimerStatus): void
    reset(currentTime: number, status: TTimerStatus): void
    changeStatus(status: TTimerStatus): void
    finish(): void
} & ICountdownTimerEvents

export interface ITimerConfig extends ICountdownTimerConfig {
    endTime?: number
    interval?: number
}

export class Timer<T extends EventMap = ITimerEvents> extends (EventEmitter as {
    new <T extends EventMap>(): TypedEmitter<T>
})<T> {
    private interval: NodeJS.Timeout | null = null
    private timeElapsed = 0
    private status: TTimerStatus = 'initial'
    private runningType: TTimerRunningType = 'normal'
    protected endTime?: number

    constructor(protected config?: ITimerConfig) {
        super()

        this.endTime = config?.endTime
    }

    setEndTime(endTime: number) {
        this.endTime = endTime
    }

    tick(emit = true) {
        if (this.endTime !== undefined && this.timeElapsed >= this.endTime) return
        this.setTimeElapsed(this.timeElapsed + 1, emit)

        // @ts-expect-error
        if (emit) this.emit('timeElapsed', this.getCurrentTime())

        this.checkEndingCountdown(emit)

        this.checkFinished(emit)
    }

    checkEndingCountdown(emit: boolean) {
        if (!this.endTime || !this.config?.endingCountdown) {
            this.changeRunningType('normal', emit)
            return
        }

        const timeElapsed = this.getTimeElapsed()

        const timeToEnd = this.endTime - timeElapsed

        if (timeToEnd > 0 && timeToEnd <= this.config.endingCountdown) {
            this.changeRunningType('finalCountdown', emit)
            // @ts-expect-error
            if (emit) this.emit('finalCountdownTick', this.getCurrentTime())
        } else {
            this.changeRunningType('normal', emit)
        }
    }

    checkFinished(emit = true) {
        const timeElapsed = this.getTimeElapsed()

        if (this.endTime !== undefined && timeElapsed >= this.endTime) {
            this.stop('finished')
            // @ts-expect-error
            if (emit) this.emit('finish')
        }
    }

    start(curentTime: number | null = null, emit = true) {
        if (curentTime === null && (this.status === 'running' || this.status === 'finished')) return
        if (curentTime !== null) {
            this.setTimeElapsed(curentTime, emit)
        }
        this.changeStatus('running', emit)
        this.setupInterval()

        if (emit) {
            // @ts-expect-error
            this.emit('start', this.getCurrentTime(), this.status)
        }
    }

    stop(newStatus: TTimerStatus = 'stopped', emit = true) {
        if (this.status === newStatus) return
        this.changeStatus(newStatus, emit)
        this.clearInterval()

        if (emit) {
            // @ts-expect-error
            this.emit('stop', this.getCurrentTime(), this.status)
        }
    }

    reset(emit = true) {
        this.stop()
        this.setTimeElapsed(0, emit)
        this.changeStatus('initial', emit)
        this.changeRunningType('normal', emit)

        if (emit) {
            // @ts-expect-error
            this.emit('reset', this.getCurrentTime(), this.status)
        }
    }

    protected changeStatus(newStatus: TTimerStatus, emit = true) {
        this.status = newStatus
        // @ts-expect-error
        if (emit) this.emit('changeStatus', this.status)
    }

    protected changeRunningType(type: TTimerRunningType, emit = true) {
        this.runningType = type
        // @ts-expect-error
        this.emit('changeRunningType', this.runningType)
    }

    setTimeElapsed(value: number, emit = true) {
        console.log(value)
        this.timeElapsed = value
        // @ts-expect-error
        if (emit) this.emit('timeElapsed', this.getCurrentTime())
    }

    getTimeElapsed() {
        return this.timeElapsed
    }

    getCurrentTime() {
        return this.getTimeElapsed()
    }

    private setupInterval() {
        this.interval = setInterval(() => {
            this.tick()
        }, this.config?.interval || 1000)
    }

    private clearInterval() {
        if (this.interval) clearInterval(this.interval)
    }
}

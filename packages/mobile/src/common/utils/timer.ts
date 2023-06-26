import { TActivityStatus, TTimerStatus } from '@common/interfaces/timers'

import { EventEmitter } from 'events'

export interface ITimer {
    status: TTimerStatus
    start(): void
    stop(): void
    reset(): void
}

export class StopwatchTimer extends EventEmitter {
    protected _startTime!: number
    protected _currentTime: number = 0
    protected tickInterval: NodeJS.Timer | undefined
    protected _intervalTimeout: number = 1000

    status: TTimerStatus = 'initial'

    constructor(private readonly end?: number) {
        super()
        this._startTime = 0
    }

    public getElapsedTime(): number {
        return this.getCurrentTime()
    }

    public getCurrentTime(): number {
        return this._currentTime
    }

    public getStartTime(): number {
        return this._startTime
    }

    protected setCurrentTime() {
        this._currentTime += Math.floor(this._intervalTimeout / 1000)
    }

    protected tick() {
        if (this.status !== 'running') return

        this.setCurrentTime()

        if (this.checkZero()) {
            this.emit('zero')
        }

        if (this.checkEnded()) {
            this.endTimer()
            return
        }

        this.emitTick()
    }

    protected setupListeners() {
        if (this.tickInterval) clearInterval(this.tickInterval)

        this.tickInterval = setInterval(() => this.tick(), this._intervalTimeout)
    }

    protected checkEnded(): boolean {
        if (!this.end || this.end <= 0) return false

        return this.getElapsedTime() >= this.end
    }

    protected checkZero(): boolean {
        if (!this.end || this.end <= 0) return false

        return this.getElapsedTime() === this.end
    }

    getRemaining() {
        if (!this.end || this.end < 0) return 0

        return this.end - this.getElapsedTime()
    }

    protected endTimer() {
        this.stop('finished')

        this.emit('end')
    }

    start(): void {
        if (this.status === 'running') return

        this.status = 'running'

        this.setupListeners()

        this.emitChangeStatus()
        this.emitStart()
    }

    stop(status: TTimerStatus = 'stopped'): void {
        if (this.tickInterval) clearInterval(this.tickInterval)

        this.setCurrentTime()
        this.status = status
        this.emitChangeStatus()
        this.emitStop()
    }

    reset(): void {
        if (this.tickInterval) clearInterval(this.tickInterval)
        this.status = 'initial'
        this._currentTime = 0
        this.emitReset()
    }

    protected emitChangeStatus() {
        this.emit('changeStatus', this.status)
    }
    protected emitReset() {
        this.emit('reset', this.getElapsedTime(), this.getStartTime(), this.getCurrentTime())
    }
    protected emitStop() {
        this.emit('stop', this.getElapsedTime(), this.getStartTime(), this.getCurrentTime())
    }
    protected emitStart() {
        this.emit('start', this.getElapsedTime(), this.getStartTime(), this.getCurrentTime())
    }
    protected emitTick() {
        this.emit('tick', this.getElapsedTime(), this.getStartTime(), this.getCurrentTime(), this.getRemaining())
    }
}

export class RegressiveTimer extends StopwatchTimer {
    constructor(private readonly from: number) {
        super()
        this._startTime = from
    }

    protected checkEnded() {
        return this.getElapsedTime() < 0
    }

    protected checkZero(): boolean {
        return this.getElapsedTime() === 0
    }

    getRemaining() {
        return this.getElapsedTime()
    }

    protected tick() {
        if (this.status !== 'running') return

        this.setCurrentTime()

        if (this.checkZero()) {
            this.emit('zero')
        }

        if (this.checkEnded()) {
            this.endTimer()
            return
        }

        this.emitTick()
    }

    public getElapsedTime(): number {
        return this.from - Math.floor(this.getCurrentTime())
    }
}

export class EmomTimer extends StopwatchTimer {
    private clock!: RegressiveTimer
    private currentRound = 1

    constructor(private readonly each: number, private readonly rounds: number) {
        super()

        this.clock = new RegressiveTimer(this.each)

        this.clock.on('end', () => this.nextRound())
        this.clock.on('tick', (...args) => this.emit('tick', ...args))
        this.clock.on('start', (...args) => this.emit('start', ...args))
        this.clock.on('zero', () => this.emit('zero', this.getCurrentRound(), this.rounds))
    }

    protected nextRound() {
        if (this.getCurrentRound() + 1 > this.rounds) {
            this.clock.stop()
            this.stop()
            this.emit('end')
            return
        }

        this.setCurrentRound(this.currentRound + 1)

        this.emit('tick', this.each)

        this.clock.reset()
        this.clock.start()
    }

    protected getCurrentRound() {
        return this.currentRound
    }

    start() {
        if (this.status === 'running') return
        this.clock.start()

        this.status = 'running'

        this.emitChangeStatus()
    }

    stop() {
        this.clock.stop()
        super.stop()
    }

    protected checkEnded(): boolean {
        return false
    }

    private setCurrentRound(n: number) {
        this.currentRound = n
        this.emit('changeRound', this.getCurrentRound(), this.getElapsedTime())
    }

    public getCurrentTime(): number {
        return this.clock.getCurrentTime()
    }

    public getStartTime(): number {
        return this.clock.getStartTime()
    }

    reset() {
        if (this.tickInterval) clearInterval(this.tickInterval)
        this.status = 'initial'
        this._currentTime = 0
        this.setCurrentRound(1)
        this.clock.reset()

        this.emit('changeStatus', this.status)
        this.emit('reset', this.getCurrentRound(), this.each, this.rounds)
    }

    public getElapsedTime(): number {
        return this.clock.getElapsedTime()
    }
}

export class TabataTimer extends StopwatchTimer {
    private clockWork!: RegressiveTimer
    private clockRest!: RegressiveTimer
    private currentRound = 1
    private activityStatus: TActivityStatus = 'work'

    constructor(private readonly work: number, private readonly rest: number, private readonly rounds: number) {
        super()

        this.clockWork = new RegressiveTimer(this.work)
        this.clockRest = new RegressiveTimer(this.rest)

        this.clockWork.on('end', () => this.next())
        this.clockRest.on('end', () => this.next())

        this.clockWork.on('tick', (...args) => this.emit('tick', ...args))
        this.clockWork.on('start', (...args) => this.emit('start', ...args))
        this.clockWork.on('zero', () => this.emit('zero', this.getCurrentRound(), this.rounds, this.activityStatus))

        this.clockRest.on('tick', (...args) => this.emit('tick', ...args))
        this.clockRest.on('start', (...args) => this.emit('start', ...args))
        this.clockRest.on('zero', () => this.emit('zero', this.getCurrentRound(), this.rounds, this.activityStatus))
    }

    private next() {
        if (this.activityStatus === 'work') {
            this.clockWork.stop()
            this.clockRest.reset()
            this.clockRest.start()
            this.setActivityStatus('rest')
        } else {
            if (this.getCurrentRound() + 1 > this.rounds) {
                super.endTimer()
                return
            }

            this.setCurrentRound(this.currentRound + 1)

            this.clockWork.reset()
            this.clockWork.start()
            this.setActivityStatus('work')
        }
    }

    protected setActivityStatus(status: TActivityStatus) {
        this.activityStatus = status
        this.emit('changeActivityStatus', this.activityStatus, this.status)
    }

    protected checkEnded(): boolean {
        return false
    }

    getCurrentRound() {
        return this.currentRound
    }

    start() {
        if (this.status === 'running') return

        if (this.activityStatus === 'work') this.clockWork.start()
        else this.clockRest.start()

        this.status = 'running'

        this.emitChangeStatus()
    }

    stop() {
        this.clockWork.stop()
        this.clockRest.stop()
        super.stop()
    }

    private setCurrentRound(n: number) {
        this.currentRound = n
        this.emit('changeRound', this.getCurrentRound(), this.getElapsedTime())
    }

    public getCurrentTime(): number {
        if (this.activityStatus === 'work') return this.clockWork.getCurrentTime()
        else return this.clockRest.getCurrentTime()
    }

    public getStartTime(): number {
        if (this.activityStatus === 'work') return this.clockWork.getStartTime()
        else return this.clockRest.getStartTime()
    }

    reset() {
        if (this.tickInterval) clearInterval(this.tickInterval)
        this.status = 'initial'
        this._currentTime = 0
        this.setCurrentRound(1)
        this.clockWork.reset()
        this.clockRest.reset()

        this.emit('changeStatus', this.status)
        this.emit('reset', this.getCurrentRound(), this.work, this.rest, this.rounds)
    }

    public getElapsedTime(): number {
        if (this.activityStatus === 'work') return this.clockWork.getElapsedTime()
        else return this.clockRest.getElapsedTime()
    }
}

import { EventEmitter } from 'events'

export type TTimerStatus = 'running' | 'stopped' | 'initial'
export interface ITimer {
    status: TTimerStatus
    start(): void
    stop(): void
    reset(): void
}

abstract class TimerBase extends EventEmitter {
    protected _startTime: number = 0
    protected _currentTime: number = 0
    protected tickInterval!: NodeJS.Timeout
    protected _intervalTimeout: number = 50
    status: TTimerStatus = 'initial'

    constructor() {
        super()
    }

    public getDisplayTime(): number {
        const count = this._currentTime - this._startTime
        return count < 0 ? 0 : count
    }

    public getCurrentTime(): number {
        return this._currentTime
    }

    public getStartTime(): number {
        return this._startTime
    }

    protected setCurrentTime(): void {
        this._currentTime = Date.now()
    }

    protected tick() {
        this.setCurrentTime()
        this.emitTick()
    }

    protected setupListeners() {
        if (this.tickInterval) clearInterval(this.tickInterval)

        this.tickInterval = setInterval(() => this.tick(), this._intervalTimeout)
    }

    start(): void {
        if (this.status === 'running') return

        this.status = 'running'

        this.setupListeners()

        this.emitChangeStatus()
        this.emitStart()
    }

    stop(): void {
        if (this.tickInterval) clearInterval(this.tickInterval)

        this.setCurrentTime()
        this.status = 'stopped'
        this.emitChangeStatus()
        this.emitStop()
    }

    reset(): void {
        if (this.tickInterval) clearInterval(this.tickInterval)
        this.status = 'initial'
        this._currentTime = 0
        this._startTime = 0
        this.emitChangeStatus()
        this.emitReset()
    }

    protected emitChangeStatus() {
        this.emit('changeStatus', this.status)
    }
    protected emitReset() {
        this.emit('reset', this.getDisplayTime(), this.getStartTime(), this.getCurrentTime())
    }
    protected emitStop() {
        this.emit('stop', this.getDisplayTime(), this.getStartTime(), this.getCurrentTime())
    }
    protected emitStart() {
        this.emit('start', this.getDisplayTime(), this.getStartTime(), this.getCurrentTime())
    }
    protected emitTick() {
        this.emit('tick', this.getDisplayTime(), this.getStartTime(), this.getCurrentTime())
    }
}

export class StopwatchTimer extends TimerBase implements ITimer {
    start() {
        if (this.status === 'running') return

        if (this._startTime === 0) this._startTime = Date.now()

        super.start()
    }
}

export class RegressiveTimer extends TimerBase {
    constructor(private readonly from: number) {
        super()
        this._intervalTimeout = 500
    }

    protected tick() {
        if (this.status !== 'running') return

        if (this.getDisplayTime() <= 0) {
            this.stop()
            this.emit('end')
            return
        }

        this._currentTime += this._intervalTimeout / 1000

        this.emitTick()
    }

    protected setCurrentTime() {
        return
    }

    public getDisplayTime(): number {
        return this.from - Math.floor(this.getCurrentTime())
    }
}

export class EmomTimer extends TimerBase {
    private clock!: StopwatchTimer
    private currentRound = 1

    constructor(private readonly each: number, private readonly rounds: number) {
        super()

        this.clock = new RegressiveTimer(this.each)

        this.clock.on('end', () => this.nextRound())
    }

    nextRound() {
        if (this.getCurrentRound() + 1 > this.rounds) {
            this.clock.stop()
            this.stop()
            this.emit('end')
            return
        }

        this.setCurrentRound(this.currentRound + 1)

        this.clock.reset()
        this.clock.start()
    }

    getCurrentRound() {
        return this.currentRound
    }

    start() {
        this.clock.start()
        super.start()
    }

    stop() {
        this.clock.stop()
        super.stop()
    }

    private setCurrentRound(n: number) {
        this.currentRound = n
        this.emit('changeRound', this.getCurrentRound(), this.getDisplayTime())
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
        this._startTime = 0
        this.setCurrentRound(1)
        this.clock.reset()

        this.emit('changeStatus', this.status)
        this.emit('reset', this.getCurrentRound(), this.each, this.rounds)
    }

    public getDisplayTime(): number {
        return this.clock.getDisplayTime()
    }
}

export class TabataTimer extends TimerBase {
    private clockWork!: StopwatchTimer
    private clockRest!: StopwatchTimer
    private currentRound = 1
    private current: 'work' | 'rest' = 'work'

    constructor(private readonly work: number, private readonly rest: number, private readonly rounds: number) {
        super()

        this.clockWork = new RegressiveTimer(this.work)
        this.clockRest = new RegressiveTimer(this.rest)

        this.clockWork.on('end', () => this.next())
        this.clockRest.on('end', () => this.next())
    }

    private next() {
        if (this.current === 'work') {
            this.clockWork.stop()
            this.clockRest.reset()
            this.clockRest.start()
            this.current = 'rest'
        } else {
            if (this.getCurrentRound() + 1 > this.rounds) {
                this.stop()
                this.emit('end')
                return
            }

            this.setCurrentRound(this.currentRound + 1)

            this.clockWork.reset()
            this.clockWork.start()
            this.current = 'work'
        }
    }

    getCurrentRound() {
        return this.currentRound
    }

    start() {
        if (this.current === 'work') this.clockWork.start()
        else this.clockRest.start()
        super.start()
    }

    stop() {
        this.clockWork.stop()
        this.clockRest.stop()
        super.stop()
    }

    private setCurrentRound(n: number) {
        this.currentRound = n
        this.emit('changeRound', this.getCurrentRound(), this.getDisplayTime())
    }

    public getCurrentTime(): number {
        if (this.current === 'work') return this.clockWork.getCurrentTime()
        else return this.clockRest.getCurrentTime()
    }

    public getStartTime(): number {
        if (this.current === 'work') return this.clockWork.getStartTime()
        else return this.clockRest.getStartTime()
    }

    reset() {
        if (this.tickInterval) clearInterval(this.tickInterval)
        this.status = 'initial'
        this._currentTime = 0
        this._startTime = 0
        this.setCurrentRound(1)
        this.clockWork.reset()
        this.clockRest.reset()

        this.emit('changeStatus', this.status)
        this.emit('reset', this.getCurrentRound(), this.work, this.rest, this.rounds)
    }

    public getDisplayTime(): number {
        if (this.current === 'work') return this.clockWork.getDisplayTime()
        else return this.clockRest.getDisplayTime()
    }
}

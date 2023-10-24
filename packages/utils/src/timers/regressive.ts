import { ITimerConfig, ITimerEvents, Timer } from './timer'

type IRegressiveTimerEvents = ITimerEvents

export interface IRegressiveTimerConfig extends Omit<ITimerConfig, 'endTime'> {
    startTime: number
}

export class RegressiveTimer extends Timer<IRegressiveTimerEvents> {
    constructor(private settings: IRegressiveTimerConfig) {
        super({ endTime: settings.startTime, ...settings })
    }

    getCurrentTime() {
        return this.settings.startTime - this.getTimeElapsed()
    }
}

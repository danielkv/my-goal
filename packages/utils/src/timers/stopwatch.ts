import { ITimerEvents, Timer } from './timer'

type IStopwatchTimerEvents = ITimerEvents

export class StopwatchTimer extends Timer<IStopwatchTimerEvents> {}

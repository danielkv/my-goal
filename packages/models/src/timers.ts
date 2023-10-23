export type TActivityStatus = 'rest' | 'work'

export type TTimerStatus = 'running' | 'stopped' | 'initial' | 'finished'

export type TTimerRunningType = 'normal' | 'initialCountdown' | 'finalCountdown'

export type TTimerType = 'tabata' | 'regressive' | 'stopwatch' | 'emom'

export interface ITimer {
    start(): void
    stop(): void
    reset(): void
}

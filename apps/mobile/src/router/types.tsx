import { IEMOMTimer, IEventBlock, IRound, ITabataTimer, ITimecapTimer } from 'goal-models'

export type TReactNavigationStackParamList = {
    LoginScreen: undefined

    EmailLoginScreen: undefined

    SubscriptionScreen?: { redirect?: ERouteName; redirectParams?: object }

    HomeScreen: undefined

    WorksheetListScreen: undefined

    TimersScreen?: { round?: IRound; block?: IEventBlock }

    EmomTimerScreen?: Partial<IEMOMTimer> & { round?: IRound; block?: IEventBlock }

    RegressiveTimerScreen?: Partial<ITimecapTimer> & { round?: IRound; block?: IEventBlock }

    TabataTimerScreen?: Partial<ITabataTimer> & { round?: IRound; block?: IEventBlock }

    StopwatchTimerScreen?: Partial<ITimecapTimer> & { round?: IRound; block?: IEventBlock }

    WorksheetList: undefined

    WorksheetDays: { id: string }

    DayView: { worksheetId: string; dayId: string }

    Profile: undefined

    WodTimer: {
        block: IEventBlock
    }
}

export enum ERouteName {
    LoginScreen = 'LoginScreen',

    EmailLoginScreen = 'EmailLoginScreen',

    SubscriptionScreen = 'SubscriptionScreen',

    HomeScreen = 'HomeScreen',

    WorksheetListScreen = 'WorksheetListScreen',

    TimersScreen = 'TimersScreen',

    RegressiveTimerScreen = 'RegressiveTimerScreen',

    StopwatchTimerScreen = 'StopwatchTimerScreen',

    EmomTimerScreen = 'EmomTimerScreen',

    TabataTimerScreen = 'TabataTimerScreen',

    WorksheetList = 'WorksheetList',

    WorksheetDays = 'WorksheetDays',

    DayView = 'DayView',

    SectionCarousel = 'SectionCarousel',

    Profile = 'Profile',

    WodTimer = 'WodTimer',
}

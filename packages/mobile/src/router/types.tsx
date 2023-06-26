import { IEventBlock, IRound } from '@models/block'
import { IEMOMTimer, ITabataTimer, ITimecapTimer } from '@models/time'

export type TReactNavigationStackParamList = {
    LoginScreen: undefined

    SubscriptionScreen: undefined

    HomeScreen: undefined

    WorksheetListScreen: undefined

    TimersScreen: undefined

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

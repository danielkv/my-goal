import { IEMOMTimer, IEventBlock, IRound, ITabataTimer, ITimecapTimer, IUserProgram } from 'goal-models'

import { UserWorkoutScreenProps } from '@view/UserWorkoutScreen'

type TRedirectParams = { redirect?: ERouteName; redirectParams?: object }

export type TReactNavigationStackParamList = {
    LoginScreen: undefined

    EmailLoginScreen: undefined

    SubscriptionScreen?: TRedirectParams

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

    UserWorkoutList: undefined
    UserWorkout: UserWorkoutScreenProps
    MovementList: undefined
    UserMovementResult: { movementId: string }

    WodTimer: {
        block: IEventBlock
    }

    ProgramList: undefined
    ProgramSegments: { program: IUserProgram }
    ProgramSession: { image: string; title: string; sessionId: string }
    ProgramGroupScreen: { groupId: string; title: string }
    ProgramMovementScreen: { movementId: string; title?: string }

    SelectSubscription?: TRedirectParams

    UserSubscription: undefined
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
    UserWorkoutList = 'UserWorkoutList',
    UserWorkout = 'UserWorkout',
    MovementList = 'MovementList',
    UserMovementResult = 'UserMovementResult',
    UserSubscription = 'UserSubscription',

    ProgramList = 'ProgramList',
    ProgramSegments = 'ProgramSegments',
    ProgramSession = 'ProgramSession',
    ProgramGroupScreen = 'ProgramGroupScreen',
    ProgramMovementScreen = 'ProgramMovementScreen',

    WodTimer = 'WodTimer',

    SelectSubscription = 'SelectSubscription',
}

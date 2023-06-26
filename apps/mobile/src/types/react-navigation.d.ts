import { TReactNavigationStackParamList } from '@router/types'

declare global {
    namespace ReactNavigation {
        interface RootParamList extends TReactNavigationStackParamList {}
    }
}

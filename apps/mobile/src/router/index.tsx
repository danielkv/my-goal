import { Platform } from 'react-native'

import { useTheme } from 'tamagui'

import Button from '@components/Button'
import { useLoggedUser } from '@contexts/user/userContext'
import { useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { User } from '@tamagui/lucide-icons'
import DayViewScreen from '@view/DayViewScreen'
import EmailLoginScreen from '@view/EmailLoginScreen'
import HomeScreen from '@view/HomeScreen'
import LoginScreen from '@view/LoginScreen'
import MovementListScreen from '@view/MovementListScreen'
import ProfileScreen from '@view/ProfileScreen'
import SubscriptionScreen from '@view/SubscriptionScreen'
import EmomTimerScreen from '@view/Timers/EmomTimerScreen'
import RegressiveTimerScreen from '@view/Timers/RegressiveTimerScreen'
import StopwatchTimerScreen from '@view/Timers/StopwatchTImerScreen'
import TabataTimerScreen from '@view/Timers/TabataTimerScreen'
import TimersScreen from '@view/Timers/TimersScreen'
import UserMovementResultScreen from '@view/UserMovementResultScreen'
import UserWorkoutListScreen from '@view/UserWorkoutListScreen'
import UserWorkoutScreen from '@view/UserWorkoutScreen'
import WodTimerScreen from '@view/WodTimerScreen'
import WorksheetDays from '@view/WorksheetDays'
import WorksheetListScreen from '@view/WorksheetListScreen'

import { ERouteName } from './types'

const Stack = createNativeStackNavigator()

function Router() {
    const theme = useTheme()
    const { navigate } = useNavigation()

    return (
        <Stack.Navigator
            screenOptions={{
                title: 'Goal',
                contentStyle: { backgroundColor: theme.gray7.val },
                headerStyle: { backgroundColor: theme.gray9.val },
                headerTitleStyle: { color: 'white' },
                headerBackTitleVisible: false,
                headerTintColor: theme.gray3.val,
                headerTitleAlign: 'left',
                animation: Platform.OS === 'android' ? 'fade_from_bottom' : 'default',
                headerRight: () => {
                    const user = useLoggedUser()

                    if (!user) return null
                    return (
                        <Button variant="icon" bg="transparent" onPress={() => navigate(ERouteName.Profile)}>
                            <User color="$gray1" />
                        </Button>
                    )
                },
            }}
            initialRouteName={ERouteName.HomeScreen}
        >
            <Stack.Screen name={ERouteName.HomeScreen} component={HomeScreen} options={{ title: 'Goal' }} />
            <Stack.Screen name={ERouteName.LoginScreen} component={LoginScreen} options={{ title: 'Acessar' }} />
            <Stack.Screen
                name={ERouteName.EmailLoginScreen}
                component={EmailLoginScreen}
                options={{ title: 'Continuar com email' }}
            />
            <Stack.Screen
                name={ERouteName.SubscriptionScreen}
                component={SubscriptionScreen}
                options={{ title: 'Cadastro' }}
            />
            <Stack.Screen
                name={ERouteName.WorksheetListScreen}
                options={{ title: 'Planilhas' }}
                component={WorksheetListScreen}
            />
            <Stack.Screen
                name={ERouteName.TimersScreen}
                component={TimersScreen}
                options={{
                    title: 'Timers',
                }}
            />
            <Stack.Screen
                name={ERouteName.RegressiveTimerScreen}
                component={RegressiveTimerScreen}
                options={{
                    title: 'Timer regressivo',
                }}
            />
            <Stack.Screen
                name={ERouteName.StopwatchTimerScreen}
                component={StopwatchTimerScreen}
                options={{
                    title: 'Cronômetro',
                }}
            />
            <Stack.Screen
                name={ERouteName.EmomTimerScreen}
                component={EmomTimerScreen}
                options={{
                    title: 'EMOM',
                }}
            />
            <Stack.Screen
                name={ERouteName.TabataTimerScreen}
                component={TabataTimerScreen}
                options={{
                    title: 'Tabata',
                }}
            />
            <Stack.Screen
                name={ERouteName.WorksheetList}
                options={{ title: 'Planilhas' }}
                component={WorksheetListScreen}
            />
            <Stack.Screen name={ERouteName.WorksheetDays} options={{ title: 'Dias' }} component={WorksheetDays} />
            <Stack.Screen name={ERouteName.DayView} options={{ title: 'Dia' }} component={DayViewScreen} />
            <Stack.Screen
                name={ERouteName.Profile}
                options={{ title: 'Meu Perfil', headerShown: false }}
                component={ProfileScreen}
            />
            <Stack.Screen
                name={ERouteName.UserWorkoutList}
                options={{ title: 'Workout' }}
                component={UserWorkoutListScreen}
            />
            <Stack.Screen
                name={ERouteName.MovementList}
                options={{ title: 'Movimentos' }}
                component={MovementListScreen}
            />

            <Stack.Screen
                name={ERouteName.UserMovementResult}
                options={{ title: 'Personal Record' }}
                component={UserMovementResultScreen}
            />

            <Stack.Screen name={ERouteName.UserWorkout} options={{ title: 'Workouts' }} component={UserWorkoutScreen} />
            <Stack.Screen name={ERouteName.WodTimer} options={{ title: 'Wod Timer' }} component={WodTimerScreen} />
        </Stack.Navigator>
    )
}

export default Router

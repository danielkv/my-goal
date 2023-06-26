import { Inter_300Light, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter'

import * as Fonts from 'expo-font'

export async function initialLoadUseCase() {
    await Fonts.loadAsync({
        Inter_300Light,
        Inter_400Regular,
        Inter_700Bold,
    })
}

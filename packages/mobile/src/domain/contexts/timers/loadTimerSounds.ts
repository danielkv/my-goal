import { Audio } from 'expo-av'

export async function loadTimerSoundsUseCase(): Promise<[Audio.Sound, Audio.Sound, Audio.Sound]> {
    const { sound: beepSound } = await Audio.Sound.createAsync(require('@assets/sounds/beep.mp3'))
    const { sound: startSound } = await Audio.Sound.createAsync(require('@assets/sounds/start.mp3'))
    const { sound: finishSound } = await Audio.Sound.createAsync(require('@assets/sounds/finish.mp3'))

    return [beepSound, startSound, finishSound]
}

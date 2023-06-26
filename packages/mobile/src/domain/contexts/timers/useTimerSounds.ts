import { useEffect, useRef } from 'react'

import { Audio } from 'expo-av'

import { loadTimerSoundsUseCase } from './loadTimerSounds'

export interface UseTimerSounds {
    playBeep(): void
    playStart(): void
    playFinish(): void
    playRoundChange(): void
}

export function useTimerSounds(silent?: boolean): UseTimerSounds {
    const beepSoundRef = useRef<Audio.Sound | null>(null)
    const startSoundRef = useRef<Audio.Sound | null>(null)
    const finishSoundRef = useRef<Audio.Sound | null>(null)

    useEffect(() => {
        async function loadSound() {
            const [beepSound, startSound, finishSound] = await loadTimerSoundsUseCase()

            beepSoundRef.current = beepSound
            startSoundRef.current = startSound
            finishSoundRef.current = finishSound
        }

        loadSound()

        return () => {
            beepSoundRef.current?.unloadAsync()
            startSoundRef.current?.unloadAsync()
            finishSoundRef.current?.unloadAsync()
        }
    }, [])

    function playBeep() {
        if (silent) return
        beepSoundRef.current?.setVolumeAsync(1)

        beepSoundRef.current?.playFromPositionAsync(0)
    }
    function playStart() {
        if (silent) return
        startSoundRef.current?.playFromPositionAsync(0)
    }
    function playFinish() {
        if (silent) return
        finishSoundRef.current?.playFromPositionAsync(0)
    }
    function playRoundChange() {
        if (silent) return
        startSoundRef.current?.playFromPositionAsync(0)
    }

    return { playBeep, playStart, playFinish, playRoundChange }
}

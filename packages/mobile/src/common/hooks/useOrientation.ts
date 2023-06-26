import { useEffect, useState } from 'react'

import { TOrientation } from '@common/interfaces/app'
import * as ScreenOrientation from 'expo-screen-orientation'

export function useOrientation(): TOrientation {
    const [orientation, setOrientation] = useState<TOrientation>('portrait')

    function handleChangeOrientation({
        orientationInfo: { orientation: _orientation },
    }: ScreenOrientation.OrientationChangeEvent) {
        if (
            [ScreenOrientation.Orientation.LANDSCAPE_RIGHT, ScreenOrientation.Orientation.LANDSCAPE_LEFT].includes(
                _orientation
            )
        ) {
            setOrientation('landscape')
        } else {
            setOrientation('portrait')
        }
    }

    useEffect(() => {
        const sub = ScreenOrientation.addOrientationChangeListener(handleChangeOrientation)

        return () => ScreenOrientation.removeOrientationChangeListener(sub)
    })

    return orientation
}

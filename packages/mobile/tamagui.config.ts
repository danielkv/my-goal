import { createAnimations } from '@tamagui/animations-react-native'
import { createInterFont } from '@tamagui/font-inter'
import { createMedia } from '@tamagui/react-native-media-driver'
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/themes'

import { createTamagui } from 'tamagui'

const animations = createAnimations({
    bouncy: { type: 'spring', damping: 10, mass: 0.9, stiffness: 100 },
    lazy: { type: 'spring', damping: 20, stiffness: 60 },
    quick: { type: 'spring', damping: 20, mass: 1.2, stiffness: 250 },
})
const headingFont = createInterFont()

const customColors = {
    red0: '#FDB9C4',
    red1: '#FB9AAA',
    red2: '#F87A8F',
    red3: '#F55C75',
    red4: '#F23E5B',
    red5: '#EE2042',
    red6: '#C81734',
    red7: '#A00F27',
    red8: '#77091B',
    red9: '#4C0511',

    gray0: '#FaFaFa',
    gray1: '#F5F5F5',
    gray2: '#D3D3D3',
    gray3: '#ABABAB',
    gray4: '#999999',
    gray5: '#666666',
    gray6: '#323232',
    gray7: '#262626',
    gray8: '#202020',
    gray9: '#101010',
}

const extendedThemes = {
    ...themes,
    light: {
        ...themes.light,
        ...customColors,
    },
    dark: {
        ...themes.dark,
        ...customColors,
        background: customColors.gray9,
    },
}

const bodyFont = createInterFont()
const config = createTamagui({
    animations,
    defaultTheme: 'dark',
    shouldAddPrefersColorThemes: false,
    themeClassNameOnRoot: false,
    shorthands,
    fonts: { heading: headingFont, body: bodyFont },
    themes: extendedThemes,
    tokens,
    media: createMedia({
        xs: { maxWidth: 660 },
        sm: { maxWidth: 800 },
        md: { maxWidth: 1020 },
        lg: { maxWidth: 1280 },
        xl: { maxWidth: 1420 },
        xxl: { maxWidth: 1600 },
        gtXs: { minWidth: 660 + 1 },
        gtSm: { minWidth: 800 + 1 },
        gtMd: { minWidth: 1020 + 1 },
        gtLg: { minWidth: 1280 + 1 },
        short: { maxHeight: 820 },
        tall: { minHeight: 820 },
        hoverNone: { hover: 'none' },
        pointerCoarse: { pointer: 'coarse' },
    }),
})

export type AppConfig = typeof config

declare module 'tamagui' {
    // overrides TamaguiCustomConfig so your custom types

    // work everywhere you import `tamagui`

    interface TamaguiCustomConfig extends AppConfig {}
}

export default config

import dotenv from 'dotenv'
import { ConfigContext, ExpoConfig } from 'expo/config'

dotenv.config()

const APP_VARIANT = process.env.APP_VARIANT
const IS_PROD = APP_VARIANT === 'production'
const ID_PREFIX = IS_PROD ? 'app' : APP_VARIANT === 'preview' ? 'prev' : 'dev'

export default ({ config }: ConfigContext): ExpoConfig => {
    return {
        ...config,
        owner: 'goal',
        name: IS_PROD ? 'My Goal' : `My Goal (${ID_PREFIX})`,
        slug: 'goal-mobile',
        version: '1.2.0',
        icon: './src/assets/icon.png',
        userInterfaceStyle: 'dark',
        splash: {
            image: './src/assets/splash.png',
            resizeMode: 'cover',
            backgroundColor: '#202020',
        },
        assetBundlePatterns: ['./src/**/*'],
        ios: {
            buildNumber: '7',
            bundleIdentifier: `${ID_PREFIX}.mygoal.goal`,
            supportsTablet: false,
            requireFullScreen: true,
            googleServicesFile: process.env.GOOGLE_SERVICES_IOS,
        },
        android: {
            versionCode: 4,
            package: `${ID_PREFIX}.mygoal.goal`,
            adaptiveIcon: {
                foregroundImage: './src/assets/adaptive-icon.png',
                backgroundColor: '#202020',
            },
            googleServicesFile: process.env.GOOGLE_SERVICES_ANDROID,
        },

        extra: {
            WEB_APP_URL: process.env.WEB_APP_URL,
            WEB_APP_RESET_PASSWORD_URL: process.env.WEB_APP_RESET_PASSWORD_URL,
            eas: {
                projectId: 'a5ca3be7-cbb0-4f41-aa54-d96bc45da066',
            },
        },

        updates: {
            url: 'https://u.expo.dev/a5ca3be7-cbb0-4f41-aa54-d96bc45da066',
        },

        runtimeVersion: {
            policy: 'sdkVersion',
        },
        plugins: [
            '@react-native-firebase/app',
            '@react-native-firebase/perf',
            '@react-native-firebase/crashlytics',
            '@react-native-firebase/auth',
            [
                'expo-screen-orientation',
                {
                    initialOrientation: 'PORTRAIT',
                },
            ],
            [
                'expo-build-properties',
                {
                    ios: {
                        useFrameworks: 'static',
                    },
                },
            ],
        ],
    }
}

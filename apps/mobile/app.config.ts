import dotenv from 'dotenv'
import { ConfigContext, ExpoConfig } from 'expo/config'

dotenv.config()

const APP_VARIANT = process.env.APP_VARIANT
const IS_PROD = APP_VARIANT === 'production'
const ID_PREFIX = IS_PROD ? 'app' : APP_VARIANT === 'preview' ? 'prev' : 'dev'
const BUNDLE_ID = `${ID_PREFIX}.mygoal.goal`
const APP_NAME = IS_PROD ? 'My Goal' : `My Goal (${ID_PREFIX})`
const RUNTIME_VERSION = '1.6.0'
const APP_VERSION = '1.6.2'

export default ({ config }: ConfigContext): ExpoConfig => {
    return {
        ...config,
        owner: 'goal',
        name: APP_NAME,
        slug: 'goal-mobile',
        version: APP_VERSION,
        icon: './src/assets/icon.png',
        userInterfaceStyle: 'dark',
        scheme: 'mygoal',
        splash: {
            image: './src/assets/splash.png',
            resizeMode: 'cover',
            backgroundColor: '#202020',
        },
        assetBundlePatterns: ['./src/assets/**/*'],
        ios: {
            usesAppleSignIn: true,
            buildNumber: '21',
            bundleIdentifier: BUNDLE_ID,
            appStoreUrl: 'https://apps.apple.com/us/app/my-goal/id6449090065',
            supportsTablet: false,
            requireFullScreen: true,
            googleServicesFile: IS_PROD
                ? process.env.GOOGLE_SERVICES_IOS
                : APP_VARIANT === 'preview'
                ? process.env.GOOGLE_SERVICES_IOS_PREV
                : process.env.GOOGLE_SERVICES_IOS_DEV,
        },
        android: {
            versionCode: 21,
            package: BUNDLE_ID,
            playStoreUrl: 'https://play.google.com/store/apps/details?id=app.mygoal.goal',
            adaptiveIcon: {
                foregroundImage: './src/assets/adaptive-icon.png',
                backgroundColor: '#202020',
            },
            googleServicesFile: process.env.GOOGLE_SERVICES_ANDROID,
            permissions: ['com.google.android.gms.permission.AD_ID'],
        },

        extra: {
            GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID,
            WEB_APP_URL: process.env.WEB_APP_URL,
            WEB_APP_RESET_PASSWORD_URL: process.env.WEB_APP_RESET_PASSWORD_URL,
            REVENUE_CAT_APPLE_KEY: process.env.REVENUE_CAT_APPLE_KEY,
            REVENUE_CAT_GOOGLE_KEY: process.env.REVENUE_CAT_GOOGLE_KEY,
            COMMUNITY_WHATSAPP_LINK: process.env.COMMUNITY_WHATSAPP_LINK,
            eas: {
                projectId: 'a5ca3be7-cbb0-4f41-aa54-d96bc45da066',
            },
        },

        updates: {
            url: 'https://u.expo.dev/a5ca3be7-cbb0-4f41-aa54-d96bc45da066',
        },

        runtimeVersion: RUNTIME_VERSION,
        plugins: [
            '@react-native-google-signin/google-signin',
            'expo-apple-authentication',
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
                    android: {
                        enableProguardInReleaseBuilds: true,
                        enableShrinkResourcesInReleaseBuilds: true,
                    },
                },
            ],
        ],
    }
}

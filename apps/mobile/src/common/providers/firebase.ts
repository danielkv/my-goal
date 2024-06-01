import analytics from '@react-native-firebase/analytics'
import firebase from '@react-native-firebase/app'
import auth from '@react-native-firebase/auth'
import crashlytics from '@react-native-firebase/crashlytics'
import { getErrorMessage } from '@utils/getErrorMessage'

type TEmulatorConfig = {
    host: string
    port: number
}

type TEmulators = 'firestore' | 'functions' | 'auth'

type TFirebaseProviderOptions = {
    emulators?: Partial<Record<TEmulators, TEmulatorConfig>>
}

class FirebaseProvider {
    constructor(readonly options?: TFirebaseProviderOptions) {
        firebase.setLogLevel('debug')
    }

    getAuth() {
        if (this.options?.emulators?.auth) {
            const { host, port } = this.options.emulators.auth
            const url = `http://${host}:${port}`
            auth().useEmulator(url)
        }

        return auth()
    }

    getAnalytics() {
        return analytics()
    }

    getCrashlytics() {
        return crashlytics()
    }

    recordError(err: any): void {
        if (err instanceof Error) return crashlytics().recordError(err)

        const error = new Error(getErrorMessage(err))
        error.stack = err.stack || ''

        return crashlytics().recordError(error)
    }
}

const useEmulator = __DEV__

export const firebaseProvider = new FirebaseProvider({
    emulators: useEmulator
        ? {
              auth: {
                  host: '10.1.1.174',
                  port: 9099,
              },
          }
        : undefined,
})

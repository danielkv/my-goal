import analytics from '@react-native-firebase/analytics'
import firebase from '@react-native-firebase/app'
import auth from '@react-native-firebase/auth'

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

import analytics from '@react-native-firebase/analytics'
import firebase from '@react-native-firebase/app'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import functions from '@react-native-firebase/functions'

type TEmulatorConfig = {
    host: string
    port: number
}

type TEmulators = 'firestore' | 'functions' | 'auth'

type TFirebaseProviderOptions = {
    emulators?: Partial<Record<TEmulators, TEmulatorConfig>>
}

type HttpsCallable<RequestData = unknown, ResponseData = unknown> = (data?: RequestData) => Promise<{
    data: ResponseData
}>

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

    getFunctions() {
        if (this.options?.emulators?.functions) {
            const { host, port } = this.options.emulators.functions
            functions().useEmulator(host, port)
        }
        return functions()
    }

    getAnalytics() {
        return analytics()
    }

    getFirestore() {
        if (this.options?.emulators?.firestore) {
            const { host, port } = this.options.emulators.firestore
            firestore().useEmulator(host, port)
        }

        return firestore()
    }

    FUNCTION_CALL<RequestData = unknown, ResponseData = unknown>(
        fnName: string
    ): HttpsCallable<RequestData, ResponseData> {
        return this.getFunctions().httpsCallable(fnName)
    }
}

const useEmulator = __DEV__

export const firebaseProvider = new FirebaseProvider({
    emulators: useEmulator
        ? {
              functions: {
                  host: '10.1.1.173',
                  port: 5001,
              },
              firestore: {
                  host: '10.1.1.173',
                  port: 8080,
              },
              auth: {
                  host: '10.1.1.173',
                  port: 9099,
              },
          }
        : undefined,
})

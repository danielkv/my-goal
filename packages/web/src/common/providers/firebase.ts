import { FirebaseApp, initializeApp } from 'firebase/app'
import { ProviderId, connectAuthEmulator, getAuth } from 'firebase/auth'
import * as firestoreFns from 'firebase/firestore'
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions'

type TEmulatorConfig = {
    host: string
    port: number
}

type TEmulators = 'firestore' | 'functions' | 'auth'

type TFirebaseProviderOptions = {
    emulators?: Partial<Record<TEmulators, TEmulatorConfig>>
}

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never

type TFS_FN_TYPES = 'collection' | 'collectionGroup' | 'doc'
type TFirestoreFns = Omit<typeof firestoreFns, TFS_FN_TYPES> & {
    [K in TFS_FN_TYPES]: OmitFirstArg<(typeof firestoreFns)[K]>
}

class FirebaseProvider {
    private app: FirebaseApp | null = null

    readonly signInOptions = [
        {
            provider: ProviderId.PASSWORD,
            fullLabel: 'Login',
            disableSignUp: { status: true },
        },
    ]

    constructor(readonly options?: TFirebaseProviderOptions) {}

    getApp() {
        if (this.app) return this.app

        this.app = initializeApp({
            apiKey: import.meta.env.VITE_APP_APIKEY,
            authDomain: import.meta.env.VITE_APP_AUTHDOMAIN,
            projectId: import.meta.env.VITE_APP_PROJECTID,
            storageBucket: import.meta.env.VITE_APP_STORAGEBUCKET,
            messagingSenderId: import.meta.env.VITE_APP_MESSAGINGSENDERID,
            appId: import.meta.env.VITE_APP_APPID,
            measurementId: import.meta.env.VITE_APP_MEASUREMENTID,
        })

        if (this.options?.emulators?.auth) {
            const auth = getAuth(this.app)
            const { host, port } = this.options.emulators.auth
            const url = `http://${host}:${port}`
            connectAuthEmulator(auth, url)
        }

        if (this.options?.emulators?.firestore) {
            const firestore = firestoreFns.getFirestore(this.app)
            const { host, port } = this.options.emulators.firestore
            firestoreFns.connectFirestoreEmulator(firestore, host, port)
        }

        if (this.options?.emulators?.functions) {
            const functions = getFunctions(this.app)
            const { host, port } = this.options.emulators.functions
            connectFunctionsEmulator(functions, host, port)
        }

        return this.app
    }

    getAuth() {
        const app = this.getApp()

        return getAuth(app)
    }

    getFunctions() {
        const app = this.getApp()

        return getFunctions(app)
    }

    getFirestore() {
        return firestoreFns.getFirestore(this.getApp())
    }

    firestore(): TFirestoreFns {
        return {
            ...firestoreFns,
            collection: (...args) => firestoreFns.collection(this.getFirestore(), ...args),
            collectionGroup: (...args) => firestoreFns.collectionGroup(this.getFirestore(), ...args),
            doc: (...args) => firestoreFns.doc(this.getFirestore(), ...args),
        }
    }

    FUNCTION_CALL<RequestData = unknown, ResponseData = unknown>(fnName: string) {
        const functions = this.getFunctions()

        return httpsCallable<RequestData, ResponseData>(functions, fnName)
    }
}

const useEmulator = import.meta.env.DEV

export const firebaseProvider = new FirebaseProvider({
    emulators: useEmulator
        ? {
              functions: {
                  host: 'localhost',
                  port: 5001,
              },
              firestore: {
                  host: 'localhost',
                  port: 8080,
              },
              auth: {
                  host: 'localhost',
                  port: 9099,
              },
          }
        : undefined,
})

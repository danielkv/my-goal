const fs = require('node:fs')
const admin = require('firebase-admin')

module.exports = function firebaseInit(certFilePath) {
    if (certFilePath) {
        if (!fs.existsSync(certFilePath)) throw new Error('Firebase Service Account file does not exist')
        admin.initializeApp({ credential: admin.credential.cert(certFilePath) })
        return
    }

    const projectId = 'goal-app-e4880'
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
    admin.initializeApp({ projectId })
}

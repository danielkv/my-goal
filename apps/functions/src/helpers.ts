import * as admin from 'firebase-admin'

let initialized = false
export function init() {
    if (!initialized) admin.initializeApp()
    initialized = true
}

import * as admin from 'firebase-admin'

export interface IMigrationFile {
    migrate(db: admin.firestore.Firestore): Promise<void>

    rollback(db: admin.firestore.Firestore): Promise<void>
}

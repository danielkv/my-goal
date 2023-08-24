// Description: add movements collection
// Migration version: 81dd4ebcae54
// Created at: 16//08/2023 13:04:32
//
import * as admin from 'firebase-admin'

const movements = [
    { movement: 'Front Squat', resultType: 'weight', countResults: 0 },
    { movement: 'Back Squat', resultType: 'weight', countResults: 0 },
    { movement: 'Overhead Squat', resultType: 'weight', countResults: 0 },
    { movement: 'Deadlift', resultType: 'weight', countResults: 0 },
    { movement: 'Sumo Deadlift High Pull', resultType: 'weight', countResults: 0 },
    { movement: 'Push Press', resultType: 'weight', countResults: 0 },
    { movement: 'Push Jerk', resultType: 'weight', countResults: 0 },
    { movement: 'Split Jerk', resultType: 'weight', countResults: 0 },
    { movement: 'Power Clean', resultType: 'weight', countResults: 0 },
    { movement: 'Hang Clean', resultType: 'weight', countResults: 0 },
    { movement: 'Snatch', resultType: 'weight', countResults: 0 },
    { movement: 'Kettlebell Swing', resultType: 'weight', countResults: 0 },
    { movement: 'Turkish Get-Up', resultType: 'weight', countResults: 0 },
    { movement: 'Thruster', resultType: 'weight', countResults: 0 },
    { movement: 'Overhead Lunge', resultType: 'weight', countResults: 0 },
    { movement: "Farmer's Carry", resultType: 'weight', countResults: 0 },
    { movement: 'Sled Push/Pull', resultType: 'weight', countResults: 0 },
    { movement: 'Clean and Jerk', resultType: 'weight', countResults: 0 },
    { movement: 'Sandbag Clean', resultType: 'weight', countResults: 0 },
    { movement: 'Dumbbell Snatch', resultType: 'weight', countResults: 0 },
    { movement: 'Dumbbell Clean and Jerk', resultType: 'weight', countResults: 0 },
    { movement: 'Atlas Stone Lift', resultType: 'weight', countResults: 0 },
    { movement: 'Barbell Complex', resultType: 'weight', countResults: 0 },
    { movement: 'Yoke Carry', resultType: 'weight', countResults: 0 },
    { movement: 'Prowler Push/Pull', resultType: 'weight', countResults: 0 },
    { movement: 'Log Lift', resultType: 'weight', countResults: 0 },
    { movement: 'Axle Deadlift', resultType: 'weight', countResults: 0 },
    { movement: 'Tire Flip', resultType: 'weight', countResults: 0 },
    { movement: 'Sandbag Shouldering', resultType: 'weight', countResults: 0 },
    { movement: 'Medicine Ball Clean', resultType: 'weight', countResults: 0 },
    { movement: 'D-ball Over Shoulder', resultType: 'weight', countResults: 0 },
    { movement: 'Axle Clean and Press', resultType: 'weight', countResults: 0 },
    { movement: 'Max BMU 5min', resultType: 'reps', countResults: 0 },
]

export async function migrate(db: admin.firestore.Firestore) {
    const movementsCollection = db.collection('movements')

    await db.runTransaction(async (transaction) => {
        movements.forEach((movement) => {
            const docRef = movementsCollection.doc()
            transaction.create(docRef, movement)
        })
    })
}

export async function rollback(db: admin.firestore.Firestore) {}

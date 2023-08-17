// Description: add movements collection
// Migration version: 81dd4ebcae54
// Created at: 16//08/2023 13:04:32
//
import * as admin from 'firebase-admin'

const movements = [
    'Front Squat',
    'Back Squat',
    'Overhead Squat',
    'Deadlift',
    'Sumo Deadlift High Pull',
    'Push Press',
    'Push Jerk',
    'Split Jerk',
    'Power Clean',
    'Hang Clean',
    'Snatch',
    'Kettlebell Swing',
    'Turkish Get-Up',
    'Thruster',
    'Overhead Lunge',
    "Farmer's Carry",
    'Sled Push/Pull',
    'Clean and Jerk',
    'Sandbag Clean',
    'Dumbbell Snatch',
    'Dumbbell Clean and Jerk',
    'Atlas Stone Lift',
    'Barbell Complex',
    'Yoke Carry',
    'Prowler Push/Pull',
    'Log Lift',
    'Axle Deadlift',
    'Tire Flip',
    'Sandbag Shouldering',
    'Medicine Ball Clean',
    'D-ball Over Shoulder',
    'Axle Clean and Press',
]

export async function migrate(db: admin.firestore.Firestore) {
    const movementsCollection = db.collection('movements')

    await db.runTransaction(async (transaction) => {
        movements.forEach((movement) => {
            const docRef = movementsCollection.doc()
            transaction.create(docRef, { movement })
        })
    })
}

export async function rollback(db: admin.firestore.Firestore) {}

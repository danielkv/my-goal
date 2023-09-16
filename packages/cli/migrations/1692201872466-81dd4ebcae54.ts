// Description: add movements collection
// Migration version: 81dd4ebcae54
// Created at: 16//08/2023 13:04:32
//
import * as admin from 'firebase-admin'

const movements = [
    { movement_insensitive: 'front squat', movement: 'Front Squat', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'back squat', movement: 'Back Squat', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'overhead squat', movement: 'Overhead Squat', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'deadlift', movement: 'Deadlift', resultType: 'weight', countResults: 0 },
    {
        movement_insensitive: 'sumo deadlift high pull',
        movement: 'Sumo Deadlift High Pull',
        resultType: 'weight',
        countResults: 0,
    },
    { movement_insensitive: 'push press', movement: 'Push Press', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'push jerk', movement: 'Push Jerk', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'split jerk', movement: 'Split Jerk', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'power clean', movement: 'Power Clean', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'hang clean', movement: 'Hang Clean', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'snatch', movement: 'Snatch', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'kettlebell swing', movement: 'Kettlebell Swing', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'turkish get-up', movement: 'Turkish Get-Up', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'thruster', movement: 'Thruster', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'overhead lunge', movement: 'Overhead Lunge', resultType: 'weight', countResults: 0 },
    { movement_insensitive: "farmer's carry", movement: "Farmer's Carry", resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'sled push/pull', movement: 'Sled Push/Pull', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'clean and jerk', movement: 'Clean and Jerk', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'sandbag clean', movement: 'Sandbag Clean', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'dumbbell snatch', movement: 'Dumbbell Snatch', resultType: 'weight', countResults: 0 },
    {
        movement_insensitive: 'dumbbell clean and jerk',
        movement: 'Dumbbell Clean and Jerk',
        resultType: 'weight',
        countResults: 0,
    },
    { movement_insensitive: 'atlas stone lift', movement: 'Atlas Stone Lift', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'barbell complex', movement: 'Barbell Complex', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'yoke carry', movement: 'Yoke Carry', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'prowler push/pull', movement: 'Prowler Push/Pull', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'log lift', movement: 'Log Lift', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'axle deadlift', movement: 'Axle Deadlift', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'tire flip', movement: 'Tire Flip', resultType: 'weight', countResults: 0 },
    {
        movement_insensitive: 'sandbag shouldering',
        movement: 'Sandbag Shouldering',
        resultType: 'weight',
        countResults: 0,
    },
    {
        movement_insensitive: 'medicine ball clean',
        movement: 'Medicine Ball Clean',
        resultType: 'weight',
        countResults: 0,
    },
    {
        movement_insensitive: 'd-ball over shoulder',
        movement: 'D-ball Over Shoulder',
        resultType: 'weight',
        countResults: 0,
    },
    {
        movement_insensitive: 'axle clean and press',
        movement: 'Axle Clean and Press',
        resultType: 'weight',
        countResults: 0,
    },
    { movement_insensitive: 'max bmu 5min', movement: 'Max BMU 5min', resultType: 'reps', countResults: 0 },
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

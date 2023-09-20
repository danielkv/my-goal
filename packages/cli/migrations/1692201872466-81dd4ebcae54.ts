// Description: add movements collection
// Migration version: 81dd4ebcae54
// Created at: 16//08/2023 13:04:32
//
import * as admin from 'firebase-admin'

const movements = [
    { movement_insensitive: 'max air squat 5min', movement: 'Max Air Squat 5min', resultType: 'reps', countResults: 0 },
    { movement_insensitive: 'front squat', movement: 'Front Squat', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'back squat', movement: 'Back Squat', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'overhead squat', movement: 'Overhead Squat', resultType: 'weight', countResults: 0 },
    {
        movement_insensitive: 'max wall ball target 5min',
        movement: 'Max Wall Ball Target 5min',
        resultType: 'reps',
        countResults: 0,
    },
    { movement_insensitive: 'thruster', movement: 'Thruster', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'deadlift', movement: 'Deadlift', resultType: 'weight', countResults: 0 },
    {
        movement_insensitive: 'sumo deadlift',
        movement: 'Sumo Deadlift',
        resultType: 'weight',
        countResults: 0,
    },
    { movement_insensitive: 'clean', movement: 'Clean', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'clean and jerk', movement: 'Clean and Jerk', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'power clean', movement: 'Power Clean', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'hang clean', movement: 'Hang Clean', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'hang power clean', movement: 'Hang Power Clean', resultType: 'weight', countResults: 0 },
    {
        movement_insensitive: 'high hang power clean',
        movement: 'High Hang Power Clean',
        resultType: 'weight',
        countResults: 0,
    },
    { movement_insensitive: 'snatch', movement: 'Snatch', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'power snatch', movement: 'Power Snatch', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'hang snatch', movement: 'Hang Snatch', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'hang power snatch', movement: 'Hang Power Snatch', resultType: 'weight', countResults: 0 },
    {
        movement_insensitive: 'high hang power snatch',
        movement: 'High Hang Power Snatch',
        resultType: 'weight',
        countResults: 0,
    },
    {
        movement_insensitive: 'max kettlebell swing 5min',
        movement: 'Max Kettlebell Swing 5min',
        resultType: 'reps',
        countResults: 0,
    },
    { movement_insensitive: 'max box jump 1min', movement: 'Max Box Jump 1min', resultType: 'reps', countResults: 0 },
    {
        movement_insensitive: 'max double-unders 1min',
        movement: 'Max Double-Unders 1min',
        resultType: 'reps',
        countResults: 0,
    },
    {
        movement_insensitive: 'max single-unders 1min',
        movement: 'Max Single-Unders 1min',
        resultType: 'reps',
        countResults: 0,
    },
    {
        movement_insensitive: 'max bar muscle-up 5min',
        movement: 'Max Bar Muscle Up 5min',
        resultType: 'reps',
        countResults: 0,
    },
    { movement_insensitive: 'max pull-up 1min', movement: 'Max Pull-Up 1min', resultType: 'reps', countResults: 0 },
    {
        movement_insensitive: 'max chest to bar pull-up 1min',
        movement: 'max Chest to Bar Pull-Up 1min',
        resultType: 'reps',
        countResults: 0,
    },

    {
        movement_insensitive: 'max ring muscle-up 5min',
        movement: 'Max Ring Muscle-Up 5min',
        resultType: 'reps',
        countResults: 0,
    },
    {
        movement_insensitive: 'max handstand push-up  1min',
        movement: 'Max Handstand Push-Up 1min',
        resultType: 'reps',
        countResults: 0,
    },
    { movement_insensitive: 'push press', movement: 'Push Press', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'push jerk', movement: 'Push Jerk', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'split jerk', movement: 'Split Jerk', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'shoulder press', movement: 'Shoulder Press', resultType: 'weight', countResults: 0 },
    { movement_insensitive: 'bench press', movement: 'Bench Press', resultType: 'weight', countResults: 0 },
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

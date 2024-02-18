/*

We are working on a security system for a badged-access room in our company's building.

Given an ordered list of employees who used their badge to enter or exit the room, write a function that returns two collections:

1. All employees who didn't use their badge while exiting the room - they recorded an enter without a matching exit. (All employees are required to leave the room before the log ends.)

2. All employees who didn't use their badge while entering the room - they recorded an exit without a matching enter. (The room is empty when the log begins.)

Each collection should contain no duplicates, regardless of how many times a given employee matches the criteria for belonging to it.

records1 = [
  ["Paul",     "enter"],
  ["Pauline",  "exit"],
  ["Paul",     "enter"],
  ["Paul",     "exit"],
  ["Martha",   "exit"],
  ["Joe",      "enter"],
  ["Martha",   "enter"],
  ["Steve",    "enter"],
  ["Martha",   "exit"],
  ["Jennifer", "enter"],
  ["Joe",      "enter"],
  ["Curtis",   "exit"],
  ["Curtis",   "enter"],
  ["Joe",      "exit"],
  ["Martha",   "enter"],
  ["Martha",   "exit"],
  ["Jennifer", "exit"],
  ["Joe",      "enter"],
  ["Joe",      "enter"],
  ["Martha",   "exit"],
  ["Joe",      "exit"],
  ["Joe",      "exit"] 
]

Expected output: ["Steve", "Curtis", "Paul", "Joe"], ["Martha", "Pauline", "Curtis", "Joe"]

Other test cases:

records2 = [
  ["Paul", "enter"],
  ["Paul", "exit"],
]

Expected output: [], []

records3 = [
  ["Paul", "enter"], 
  ["Paul", "enter"],
  ["Paul", "exit"], 
  ["Paul", "exit"], 
]

Expected output: ["Paul"], ["Paul"]

records4 = [
  ["Raj", "enter"],
  ["Paul", "enter"],
  ["Paul", "exit"],
  ["Paul", "exit"],
  ["Paul", "enter"],
  ["Raj", "enter"],
]

Expected output: ["Raj", "Paul"], ["Paul"]

All Test Cases:
mismatches(records1) => ["Steve", "Curtis", "Paul", "Joe"], ["Martha", "Pauline", "Curtis", "Joe"]
mismatches(records2) => [], []
mismatches(records3) => ["Paul"], ["Paul"]
mismatches(records4) => ["Raj", "Paul"], ["Paul"]

n: length of the badge records array

*/

'use strict'

const { uniq } = require('lodash')

const records1 = [
    ['Paul', 'enter'],
    ['Pauline', 'exit'],
    ['Paul', 'enter'],
    ['Paul', 'exit'],
    ['Martha', 'exit'],
    ['Joe', 'enter'],
    ['Martha', 'enter'],
    ['Steve', 'enter'],
    ['Martha', 'exit'],
    ['Jennifer', 'enter'],
    ['Joe', 'enter'],
    ['Curtis', 'exit'],
    ['Curtis', 'enter'],
    ['Joe', 'exit'],
    ['Martha', 'enter'],
    ['Martha', 'exit'],
    ['Jennifer', 'exit'],
    ['Joe', 'enter'],
    ['Joe', 'enter'],
    ['Martha', 'exit'],
    ['Joe', 'exit'],
    ['Joe', 'exit'],
]

const records2 = [
    ['Paul', 'enter'],
    ['Paul', 'exit'],
]

const records3 = [
    ['Paul', 'enter'],
    ['Paul', 'enter'],
    ['Paul', 'exit'],
    ['Paul', 'exit'],
]

const records4 = [
    ['Raj', 'enter'],
    ['Paul', 'enter'],
    ['Paul', 'exit'],
    ['Paul', 'exit'],
    ['Paul', 'enter'],
    ['Raj', 'enter'],
]

function mismatches(records) {
    const arr = []
    const arr2 = []
    const acc1 = {}
    const acc2 = {}

    for (const record of records) {
        if (record[1] == 'enter') {
            acc1[record[0]] = 'enter'
            arr.push(record[0])

            acc2[record[0]] = 'enter'
        } else {
            if (acc1[record[0]] && acc1[record[0]] == 'enter') {
                const index = arr.findIndex((name) => name == record[0])
                if (index > -1) arr.splice(index, 1)
            }

            acc1[record[0]] = 'exit'

            if (!acc2[record[0]] || acc2[record[0]] === 'exit') {
                arr2.push(record[0])
            }

            acc2[record[0]] = 'exit'
        }
    }

    // records.reduce((acc, item) => {
    //     if (item[1] == 'enter') {
    //         acc[item[0]] = 'enter'
    //         arr.push(item[0])

    //     } else {
    //         if (acc[item[0]] && acc[item[0]] == 'enter') {
    //             const index = arr.findIndex((name) => name == item[0])
    //             if (index > -1) arr.splice(index, 1)
    //         }

    //         acc[item[0]] = 'exit'
    //     }

    //     return acc
    // }, {})

    // records.reduce((acc, item) => {
    //     if (item[1] == 'exit') {
    //         if (!acc[item[0]] || acc[item[0]] === 'exit') {
    //             arr2.push(item[0])
    //         }
    //         acc[item[0]] = 'exit'
    //     } else {
    //         acc[item[0]] = 'enter'
    //     }

    //     return acc
    // }, {})

    return [uniq(arr), uniq(arr2)]
}

console.log(mismatches(records1))

/*
All Test Cases:
mismatches(records1) => ["Steve", "Curtis", "Paul", "Joe"], ["Martha", "Pauline", "Curtis", "Joe"]
mismatches(records2) => [], []
mismatches(records3) => ["Paul"], ["Paul"]
mismatches(records4) => ["Raj", "Paul"], ["Paul"]

n: length of the badge records array

*/

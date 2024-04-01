import { IWorksheetInput, Typefy } from 'goal-models'

import { Setter } from 'solid-js'

import { FieldArrayPath, FieldArrayStore, FormStore } from '@modular-forms/solid'

export type FileArrayPath = `${FieldArrayPath<Typefy<IWorksheetInput<'v2'>>>}.${number}`

export interface IWorksheetFormCommon {
    form: FormStore<Typefy<IWorksheetInput<'v2'>>, undefined>
}
export interface IWorksheetArrayFormCommon<Path extends FieldArrayPath<Typefy<IWorksheetInput<'v2'>>>>
    extends IWorksheetFormCommon {
    arrProps: FieldArrayStore<Typefy<IWorksheetInput>, Path>
    index: number
    selectedPath: FileArrayPath | null
    setSelectedPath: Setter<FileArrayPath | null>
}

import { IWorksheet } from 'goal-models'

import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'

import { Path } from '@interfaces/app'
import { createWorksheetValues } from '@utils/worksheetInitials'

export const [currentPath, setCurrentPath] = createSignal<Path>('worksheet')

export const [worksheetStore, setWorksheetStore] = createStore<IWorksheet>(createWorksheetValues())

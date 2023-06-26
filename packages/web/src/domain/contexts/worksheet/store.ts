import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'

import { Path } from '@interfaces/app'
import { IWorksheet } from '@models/day'
import { createWorksheetValues } from '@utils/worksheetInitials'

export const [currentPath, setCurrentPath] = createSignal<Path>('worksheet')

export const [worksheetStore, setWorksheetStore] = createStore<IWorksheet>(createWorksheetValues())

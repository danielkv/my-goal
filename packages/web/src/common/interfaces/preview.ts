import { TPeaces } from '@models/day'

import { Path } from './app'

export interface Controllable {
    onAdd?(path: Path, initialValues: TPeaces): void
    onRemove?(path: Path): void
    onMove?(path: Path, to: 'up' | 'down'): void
    onClickPeace?(key: Path): void
}

export interface WorksheetPeace<T> extends Omit<Controllable, 'onOpenEdit'> {
    onUpdate?(path: Path, newValue: TPeaces): void
    currentPath?: Path
    item: T
    thisPath: Path
}

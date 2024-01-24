import { ISorting } from 'goal-models'

export function getSorting<T extends object>({ sortBy, order }: ISorting<T>, defaultsSortBy?: keyof T) {
    return { sortBy: sortBy || defaultsSortBy || 'id', order: order || 'asc' }
}

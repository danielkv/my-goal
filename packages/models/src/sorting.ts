export interface ISorting<T extends object> {
    sortBy?: keyof T
    order?: 'asc' | 'desc'
}

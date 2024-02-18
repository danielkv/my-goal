import { IPaginatedResponse, IPagination } from 'goal-models'

export function getPagination({ page = 0, pageSize = 20 }: IPagination) {
    const from = page * pageSize
    const to = from + pageSize - 1

    return { from, to }
}

export function buildPaginatedResponse<T>(
    items: T[],
    totalCount: number,
    { page = 0, pageSize = 20 }: IPagination
): IPaginatedResponse<T> {
    const lastPage = Math.ceil(totalCount / pageSize)
    const nextPage = page + 1 < lastPage ? page + 1 : null

    return { lastPage, nextPage, total: totalCount, items }
}

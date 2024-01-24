import { Pagination } from '@supabase/supabase-js'

export interface IPagination {
    page?: number
    pageSize?: number
}

export interface IPaginatedResponse<T = any> extends Pagination {
    items: T[]
}

import { Database as DatabaseGenerated } from '../database.types'
import { MergeDeep } from 'type-fest'

export type Database = MergeDeep<
    DatabaseGenerated,
    {
        public: {}
    }
>

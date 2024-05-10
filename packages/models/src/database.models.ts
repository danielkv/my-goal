import { Database as DatabaseGenerated } from '../database.types'
import { IEventBlock } from './block'
import { IPeriod } from './day'
import { TResultType } from './result'
import { MergeDeep } from 'type-fest'

export type DatabaseModel = MergeDeep<
    DatabaseGenerated,
    {
        public: {
            Tables: {
                days: {
                    Row: {
                        periods: IPeriod<'v1'>[] | IPeriod<'v2'>[]
                    }
                    Insert: {
                        periods: IPeriod<'v1'>[] | IPeriod<'v2'>[]
                    }
                    Update: {
                        periods: IPeriod<'v1'>[] | IPeriod<'v2'>[]
                    }
                }
                workout_results: {
                    Row: {
                        workout: IEventBlock
                        resultType: TResultType
                    }
                    Insert: {
                        workout: IEventBlock
                        resultType: TResultType
                    }
                    Update: {
                        workout?: IEventBlock
                        resultType?: TResultType
                    }
                }
                movements: {
                    Row: {
                        resultType: TResultType
                        video?: string
                        text?: string
                    }
                    Insert: {
                        resultType: TResultType
                        video?: string
                        text?: string
                    }
                    Update: {
                        resultType?: TResultType
                        video?: string
                        text?: string
                    }
                }
                movement_results: {
                    Row: {
                        resultType: TResultType
                    }
                    Insert: {
                        resultType: TResultType
                    }
                    Update: {
                        resultType: TResultType
                    }
                }
                programs: {
                    Row: {
                        block_segments: 'none' | 'weekly' | 'monthly'
                    }
                    Insert: {
                        block_segments: 'none' | 'weekly' | 'monthly'
                        image?: File | string | null
                    }
                    Update: {
                        block_segments?: 'none' | 'weekly' | 'monthly'
                        image?: File | string | null
                    }
                }
            }
            Views: {
                highest_movement_results: {
                    Row: {
                        resultType: TResultType
                        resultValue: number
                    }
                }
                users: {
                    Row: {
                        id: string
                        displayName: string
                        email: string
                        emailVerified: boolean
                        admin: boolean
                        disabled: boolean
                    }
                }
            }
        }
    }
>

export type Models<
    PublicTableNameOrOptions extends
        | keyof (DatabaseModel['public']['Tables'] & DatabaseModel['public']['Views'])
        | { schema: keyof DatabaseModel },
    TableName extends PublicTableNameOrOptions extends { schema: keyof DatabaseModel }
        ? keyof (DatabaseModel[PublicTableNameOrOptions['schema']]['Tables'] &
              DatabaseModel[PublicTableNameOrOptions['schema']]['Views'])
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof DatabaseModel }
    ? (DatabaseModel[PublicTableNameOrOptions['schema']]['Tables'] &
          DatabaseModel[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
          Row: infer R
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (DatabaseModel['public']['Tables'] & DatabaseModel['public']['Views'])
    ? (DatabaseModel['public']['Tables'] & DatabaseModel['public']['Views'])[PublicTableNameOrOptions] extends {
          Row: infer R
      }
        ? R
        : never
    : never

export type ModelsInsert<
    PublicTableNameOrOptions extends keyof DatabaseModel['public']['Tables'] | { schema: keyof DatabaseModel },
    TableName extends PublicTableNameOrOptions extends { schema: keyof DatabaseModel }
        ? keyof DatabaseModel[PublicTableNameOrOptions['schema']]['Tables']
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof DatabaseModel }
    ? DatabaseModel[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Insert: infer I
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof DatabaseModel['public']['Tables']
    ? DatabaseModel['public']['Tables'][PublicTableNameOrOptions] extends {
          Insert: infer I
      }
        ? I
        : never
    : never

export type ModelsUpdate<
    PublicTableNameOrOptions extends keyof DatabaseModel['public']['Tables'] | { schema: keyof DatabaseModel },
    TableName extends PublicTableNameOrOptions extends { schema: keyof DatabaseModel }
        ? keyof DatabaseModel[PublicTableNameOrOptions['schema']]['Tables']
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof DatabaseModel }
    ? DatabaseModel[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
          Update: infer U
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof DatabaseModel['public']['Tables']
    ? DatabaseModel['public']['Tables'][PublicTableNameOrOptions] extends {
          Update: infer U
      }
        ? U
        : never
    : never

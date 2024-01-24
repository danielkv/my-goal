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
                profiles: {
                    Row: {
                        displayName: string
                        email: string
                    }
                }
                days: {
                    Row: {
                        periods: IPeriod[] | null
                    }
                    Insert: {
                        periods: IPeriod[] | null
                    }
                    Update: {
                        periods: IPeriod[] | null
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
                        workout: IEventBlock
                        resultType: TResultType
                    }
                }
                movements: {
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
            }
            Views: {
                highest_movement_results: {
                    Row: {
                        resultType: TResultType
                        resultValue: number
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

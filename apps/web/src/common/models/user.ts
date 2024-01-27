import { IPaginatedResponse, IUserData } from 'goal-models'

export interface IUserCredential extends IUserData {}

export type ListUsersResult = IPaginatedResponse<IUserData[]>

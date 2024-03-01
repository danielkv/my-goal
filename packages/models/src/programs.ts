import { Models, ModelsInsert } from './database.models'

export type IProgramGroupInput = ModelsInsert<'program_groups'> & {
    movements: ModelsInsert<'program_movements'>[]
}

export type IProgramSessionInput = ModelsInsert<'program_sessions'> & {
    groups: IProgramGroupInput[]
}

export type IProgramSegmentInput = ModelsInsert<'program_segments'> & {
    sessions: IProgramSessionInput[]
}

export type IProgramInput = ModelsInsert<'programs'> & {
    segments: IProgramSegmentInput[]
}

export type IProgramGroup = Models<'program_groups'> & { movements: Models<'program_movements'>[] }

export type IProgramSession = Models<'program_sessions'> & { classes: IProgramGroup[] }

export type IProgramSegment = Models<'program_segments'> & {
    sessions: IProgramSession[]
}

export type IProgram = Models<'programs'> & {
    segments: IProgramSegment[]
}

export type IUserProgram = Models<'programs'> & {
    user_programs: Models<'user_programs'>[]
}

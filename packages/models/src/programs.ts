import { Models, ModelsInsert } from './database.models'

export type IProgramSessionInput = ModelsInsert<'program_sessions'> & {
    classes: ModelsInsert<'program_classes'>[]
}

export type IProgramSegmentInput = ModelsInsert<'program_segments'> & {
    sessions: IProgramSession[]
}

export type IProgramInput = ModelsInsert<'programs'> & {
    segments: IProgramSegment[]
}

export type IProgramSession = Models<'program_sessions'> & { classes: Models<'program_classes'>[] }

export type IProgramSegment = Models<'program_segments'> & {
    sessions: IProgramSession[]
}

export type IProgram = Models<'programs'> & {
    segments: IProgramSegment[]
}

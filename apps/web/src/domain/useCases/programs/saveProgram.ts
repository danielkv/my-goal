import { IProgramInput } from 'goal-models'
import { omit } from 'radash'

import { supabase } from '@common/providers/supabase'
import { uploadFileUseCase } from '@useCases/upload/uploadFile'

const BUCKET_ID = 'programs'

export async function saveProgramUseCase(data: IProgramInput): Promise<void> {
    const program = _prepareData(data)

    if (data.image) {
        program.image = await uploadFileUseCase(data.image, BUCKET_ID)
    } else delete program.image

    const programToSave = omit(program, ['segments'])

    const { error: programError } = await supabase
        .from('programs')
        .upsert(programToSave, { onConflict: 'id', ignoreDuplicates: false })
    if (programError) throw programError

    const segmentsToSave = program.segments.map((segment) => omit(segment, ['sessions']))
    const { error: segmentsError } = await supabase
        .from('program_segments')
        .upsert(segmentsToSave, { onConflict: 'id', ignoreDuplicates: false })
    if (segmentsError) throw segmentsError

    const sessionsToSave = program.segments.flatMap((segment) =>
        segment.sessions.map((session) => omit(session, ['classes']))
    )
    const { error: sessionsError } = await supabase
        .from('program_sessions')
        .upsert(sessionsToSave, { onConflict: 'id', ignoreDuplicates: false })
    if (sessionsError) throw sessionsError

    const classesToSave = program.segments.flatMap((segment) => segment.sessions.flatMap((session) => session.classes))
    const { error: classesError } = await supabase
        .from('program_classes')
        .upsert(classesToSave, { onConflict: 'id', ignoreDuplicates: false })
    if (classesError) throw classesError
}

function _prepareData(program: IProgramInput): IProgramInput {
    const programId = program.id || self.crypto.randomUUID()
    return {
        ...program,
        id: programId,
        segments: program.segments.map((segment) => {
            const segmentId = segment.id || self.crypto.randomUUID()
            return {
                ...segment,
                program_id: programId,
                id: segmentId,
                sessions: segment.sessions.map((session) => {
                    const sessionId = session.id || self.crypto.randomUUID()
                    return {
                        ...session,
                        segment_id: segmentId,
                        id: sessionId,
                        classes: session.classes.map((pClass) => {
                            const classId = pClass.id || self.crypto.randomUUID()
                            return {
                                ...pClass,
                                session_id: sessionId,
                                id: classId,
                            }
                        }),
                    }
                }),
            }
        }),
    }
}
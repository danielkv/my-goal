import { IProgramInput } from 'goal-models'
import { omit } from 'radash'

import { supabase } from '@common/providers/supabase'

const BUCKET_ID = 'programs'

export async function saveProgramUseCase(data: IProgramInput): Promise<void> {
    const program = _prepareData(data)

    if (data.image) {
        if (!(data.image instanceof File)) throw new Error('Formato da imagem inválido')

        program.image = await _uploadImage(data.image)
    } else delete program.image

    const programToSave = omit(program, ['segments'])
    const { error: programError } = await supabase.from('programs').upsert(programToSave)
    if (programError) throw programError

    const segmentsToSave = program.segments.map((segment) => omit(segment, ['sessions']))
    const { error: segmentsError } = await supabase.from('program_segments').upsert(segmentsToSave)
    if (segmentsError) throw segmentsError

    const sessionsToSave = program.segments.flatMap((segment) =>
        segment.sessions.map((session) => omit(session, ['classes']))
    )
    const { error: sessionsError } = await supabase.from('program_sessions').upsert(sessionsToSave)
    if (sessionsError) throw sessionsError

    const classesToSave = program.segments.flatMap((segment) => segment.sessions.flatMap((session) => session.classes))
    const { error: classesError } = await supabase.from('program_classes').upsert(classesToSave)
    if (classesError) throw classesError
}

async function _uploadImage(file: File): Promise<string> {
    const { error } = await supabase.storage.getBucket(BUCKET_ID)
    if (error) {
        const { error: bucketError } = await supabase.storage.createBucket(BUCKET_ID, {
            public: true,
            allowedMimeTypes: ['image/*'],
        })
        if (bucketError) throw bucketError
    }

    const { error: imageError, data: imageData } = await supabase.storage.from(BUCKET_ID).upload(file.name, file)
    if (imageError) throw imageError

    return supabase.storage.from(BUCKET_ID).getPublicUrl(imageData.path).data.publicUrl
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

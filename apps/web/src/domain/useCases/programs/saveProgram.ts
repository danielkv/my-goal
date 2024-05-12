import { IProgramInput, Models } from 'goal-models'
import { diff, omit } from 'radash'

import { supabase } from '@common/providers/supabase'
import { uploadFileUseCase } from '@useCases/upload/uploadFile'

const BUCKET_ID = 'programs'

interface ISavePaymentLinkResponse {
    payment_link_id: string
    payment_link_url: string
}

export async function saveProgramUseCase(data: IProgramInput): Promise<{
    program: Models<'programs'>
    error?: string
}> {
    const program = _prepareData(data)

    await _removeDeletedProgramParts(program)

    if (data.image) {
        program.image = await uploadFileUseCase(data.image, BUCKET_ID)
    } else delete program.image

    const programToSave = omit(program, ['segments'])

    const { error: programError, data: programSaved } = await supabase
        .from('programs')
        .upsert(programToSave, { onConflict: 'id', ignoreDuplicates: false })
        .select()
        .single()
    if (programError) throw programError

    const segmentsToSave = program.segments.map((segment) => omit(segment, ['sessions']))
    const { error: segmentsError } = await supabase
        .from('program_segments')
        .upsert(segmentsToSave, { onConflict: 'id', ignoreDuplicates: false })
    if (segmentsError) throw segmentsError

    const sessionsToSave = program.segments.flatMap((segment) =>
        segment.sessions.map((session) => omit(session, ['groups']))
    )
    const { error: sessionsError } = await supabase
        .from('program_sessions')
        .upsert(sessionsToSave, { onConflict: 'id', ignoreDuplicates: false })
    if (sessionsError) throw sessionsError

    const groupsToSave = program.segments.flatMap((segment) =>
        segment.sessions.flatMap((session) => session.groups.map((group) => omit(group, ['movements'])))
    )
    const { error: groupsError } = await supabase
        .from('program_groups')
        .upsert(groupsToSave, { onConflict: 'id', ignoreDuplicates: false })
    if (groupsError) throw groupsError

    const movementsToSave = program.segments.flatMap((segment) =>
        segment.sessions.flatMap((session) => session.groups.flatMap((group) => group.movements))
    )

    const { error: movementsError } = await supabase
        .from('program_movements')
        .insert(movementsToSave.map((item) => omit(item, ['id'])))
    if (movementsError) throw movementsError

    if (programSaved.amount > 0 || programSaved.payment_link_id) {
        try {
            await _savePaymentLink(programSaved)
        } catch (err) {
            return { program: programSaved, error: 'Link de pagamento não foi criado' }
        }
    }

    return { program: programSaved }
}

async function _removeDeletedProgramParts(program: IProgramInput) {
    if (!program.id) return

    const { error: segmentError, data: segmentData } = await supabase
        .from('program_segments')
        .select()
        .eq('program_id', program.id)
    if (segmentError) throw segmentError
    if (!segmentData.length) return

    {
        const segmentIdsToDelete = diff(
            segmentData.map((i) => i.id),
            program.segments.map((s) => s.id)
        )

        if (segmentIdsToDelete.length) {
            const { error } = await supabase.from('program_segments').delete().in('id', segmentIdsToDelete)
            if (error) throw error
        }
    }

    const { error: sessionsError, data: sessionsData } = await supabase
        .from('program_sessions')
        .select()
        .in(
            'segment_id',
            segmentData.map((s) => s.id)
        )
    if (sessionsError) throw sessionsError
    if (!sessionsData.length) return

    {
        const sessionsIdsToDelete = diff(
            sessionsData.map((i) => i.id),
            program.segments.flatMap((s) => s.sessions.map((s) => s.id))
        )

        if (sessionsIdsToDelete.length) {
            const { error } = await supabase.from('program_sessions').delete().in('id', sessionsIdsToDelete)
            if (error) throw error
        }
    }

    const { error: groupsError, data: groupsData } = await supabase
        .from('program_groups')
        .select()
        .in(
            'session_id',
            sessionsData.map((s) => s.id)
        )
    if (groupsError) throw groupsError
    if (!groupsData.length) return

    {
        const groupsIdsToDelete = diff(
            groupsData.map((i) => i.id),
            program.segments.flatMap((s) => s.sessions.flatMap((s) => s.groups.map((s) => s.id)))
        )

        if (groupsIdsToDelete.length) {
            const { error } = await supabase.from('program_groups').delete().in('id', groupsIdsToDelete)
            if (error) throw error
        }
    }

    const { error: movementsError } = await supabase
        .from('program_movements')
        .delete()
        .in(
            'group_id',
            groupsData.map((s) => s.id)
        )
    if (movementsError) throw movementsError
}

async function _savePaymentLink(programSaved: Models<'programs'>) {
    const { error, data } = await supabase.functions.invoke<ISavePaymentLinkResponse>('/payments/save-payment-link', {
        method: 'POST',
        body: {
            name: programSaved.name,
            price: programSaved.amount,
            payment_link_id: programSaved.payment_link_id,
        },
    })
    if (error) throw error
    if (!data) throw new Error('Erro ao salvar o link de pagamento')

    const { error: programError } = await supabase
        .from('programs')
        .update({ payment_link_id: data.payment_link_id, payment_link_url: data.payment_link_url })
        .eq('id', programSaved.id)

    if (programError) throw programError
}

function _prepareData(program: IProgramInput): IProgramInput {
    const programId = program.id || self.crypto.randomUUID()
    return {
        ...program,
        id: programId,
        segments: program.segments.map((segment, segmentOrder) => {
            const segmentId = segment.id || self.crypto.randomUUID()
            return {
                ...segment,
                order: segmentOrder,
                program_id: programId,
                id: segmentId,
                sessions: segment.sessions.map((session, sessionOrder) => {
                    const sessionId = session.id || self.crypto.randomUUID()
                    return {
                        ...session,
                        order: sessionOrder,
                        segment_id: segmentId,
                        id: sessionId,
                        groups: session.groups.map((group, groupOrder) => {
                            const groupId = group.id || self.crypto.randomUUID()
                            return {
                                ...group,
                                order: groupOrder,
                                session_id: sessionId,
                                id: groupId,
                                movements:
                                    group.movements?.map((movement, movementOrder) => {
                                        const movementId = movement.id || self.crypto.randomUUID()
                                        return {
                                            ...movement,
                                            order: movementOrder,
                                            group_id: groupId,
                                            id: movementId,
                                        }
                                    }) || [],
                            }
                        }),
                    }
                }),
            }
        }),
    }
}

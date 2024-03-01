import { IProgramInput, Models } from 'goal-models'
import { diff, omit } from 'radash'

import { supabase } from '@common/providers/supabase'
import { uploadFileUseCase } from '@useCases/upload/uploadFile'

const BUCKET_ID = 'programs'

interface IStripeProductResponse {
    product_id: string
    payment_url: string
    payment_link_id: string
}

export async function saveProgramUseCase(data: IProgramInput): Promise<Models<'programs'>> {
    const previousProgram = await _getPreviousProgram(data.id)
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
        .upsert(movementsToSave, { onConflict: 'id', ignoreDuplicates: false })
    if (movementsError) throw movementsError

    await _createUpdateStripeProduct(programSaved, previousProgram, data)

    return programSaved
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

    const { error: movementsError, data: movementsData } = await supabase
        .from('program_movements')
        .select()
        .in(
            'group_id',
            groupsData.map((s) => s.id)
        )
    if (movementsError) throw movementsError
    if (!movementsData.length) return

    {
        const movementIdsToDelete = diff(
            movementsData.map((i) => i.id),
            program.segments.flatMap((s) =>
                s.sessions.flatMap((s) => s.groups.flatMap((s) => s.movements.map((s) => s.id)))
            )
        )

        if (movementIdsToDelete.length) {
            const { error } = await supabase.from('program_movements').delete().in('id', movementIdsToDelete)
            if (error) throw error
        }
    }
}

async function _createUpdateStripeProduct(
    programSaved: Models<'programs'>,
    previousProgram: Models<'programs'> | null,
    formData: IProgramInput
) {
    if (!previousProgram?.stripe_product_id) {
        const { payment_link_id, payment_url, product_id } = await _createStripeProduct(
            programSaved.id,
            programSaved.name,
            programSaved.amount
        )

        const { error: programError } = await supabase
            .from('programs')
            .update({ stripe_product_id: product_id, stripe_payment_link_id: payment_link_id, payment_url })
            .eq('id', programSaved.id)
        if (programError) throw programError
    } else if (previousProgram && formData.amount !== previousProgram.amount) {
        const { payment_link_id, payment_url } = await _updateStripeProduct(
            previousProgram.stripe_product_id,
            programSaved.amount
        )

        const { error: programError } = await supabase
            .from('programs')
            .update({ stripe_payment_link_id: payment_link_id, payment_url })
            .eq('id', programSaved.id)
        if (programError) throw programError
    }
}

async function _getPreviousProgram(programId?: string | null): Promise<Models<'programs'> | null> {
    if (!programId) return null
    const { error, data } = await supabase.from('programs').select().eq('id', programId).single()

    if (error) throw error

    return data
}

async function _updateStripeProduct(product_id: string, price: number): Promise<IStripeProductResponse> {
    const { error, data } = await supabase.functions.invoke<IStripeProductResponse>('/stripe/update-program-product', {
        method: 'POST',
        body: { price: price * 100, product_id },
    })

    if (error) throw error
    if (!data) throw new Error('Produto não alterado')

    return data
}

async function _createStripeProduct(
    programId: string,
    programName: string,
    price: number
): Promise<IStripeProductResponse> {
    const { error, data } = await supabase.functions.invoke<IStripeProductResponse>('/stripe/create-program-product', {
        method: 'POST',
        body: { name: programName, price: price * 100, programId },
    })

    if (error) throw error
    if (!data) throw new Error('Produto não criado')

    return data
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
                        groups: session.groups.map((group) => {
                            const groupId = group.id || self.crypto.randomUUID()
                            return {
                                ...group,
                                session_id: sessionId,
                                id: groupId,
                                movements: group.movements.map((movement) => {
                                    const movementId = movement.id || self.crypto.randomUUID()
                                    return {
                                        ...movement,
                                        group_id: groupId,
                                        id: movementId,
                                    }
                                }),
                            }
                        }),
                    }
                }),
            }
        }),
    }
}

// deno-lint-ignore-file no-explicit-any
import { createSupabaseClient } from '../_shared/client.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
    if (req.method !== 'POST') return new Response('Invalid method', { status: 405, headers: corsHeaders })

    const { type, record } = await req.json()
    if (type !== 'INSERT') return new Response('Invalid event type', { status: 405, headers: corsHeaders })

    const fbuid = record.raw_user_meta_data.fbuid
    if (!fbuid) return new Response('fbuid not found', { status: 200, headers: corsHeaders })

    const supabase = createSupabaseClient(req)

    try {
        const movementRestults = await migrateMovementResults(supabase, fbuid, record)
        const workoutRestults = 0

        return new Response(
            JSON.stringify({ userId: record.id, fbuid, movements: movementRestults, workouts: workoutRestults }),
            { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
    } catch (err) {
        return new Response(err.message, { status: 500, headers: corsHeaders })
    }
})

async function migrateMovementResults(supabase: SupabaseClient, fbuid: string, record: any) {
    const { data, error } = await supabase
        .from('fb_movement_results')
        .select('attrs')
        .contains('attrs->fields->uid', { stringValue: fbuid })

    if (error) throw error

    if (data?.length) {
        const oldIds = data.map(
            ({
                attrs: {
                    fields: {
                        movementId: { stringValue },
                    },
                },
            }) => stringValue
        )

        const { data: movementIIdMapping, error } = await supabase.from('movements').select('*').in('fb_old_id', oldIds)
        if (error || !movementIIdMapping)
            return new Response(error.message || 'empty mapping', { status: 500, headers: corsHeaders })

        const newIdMappings = movementIIdMapping.reduce((acc, item) => {
            acc[item.fb_old_id] = item.id
            return acc
        }, {})

        const movement_results_data = data.reduce<Record<string, any>[]>((acc, item) => {
            const { fields } = item.attrs
            const oldMovementId = fields.movementId.stringValue
            const movementId = newIdMappings[oldMovementId]

            if (movementId !== undefined) {
                acc.push({
                    movementId,
                    date: fields.date.stringValue,
                    resultType: fields.result.mapValue.fields.type.stringValue,
                    resultValue: fields.result.mapValue.fields.value.integerValue,
                    userId: record.id,
                    isPrivate: fields.isPrivate.booleanValue,
                })
            }

            return acc
        }, [] as Record<string, any>[])

        const { error: inserError } = await supabase.from('movement_results').insert(movement_results_data)
        if (inserError) throw inserError

        return movement_results_data.length
    }

    return 0
}

// async function migrateWorkoutResults(supabase: SupabaseClient, fbuid: string, record: any) {
//     const { data, error } = await supabase
//         .from('fb_workout_results')
//         .select('attrs')
//         .contains('attrs->fields->uid', { stringValue: fbuid })

//     if (error) throw error

//     if (data?.length) {
//         const movement_results_data = data.map((item) => {
//             const { fields } = item.attrs
//             return {
//                 userId: record.id,
//                 workout: fields.workout.mapValue.fields.type.stringValue,
//                 date: fields.date.stringValue,
//                 resultType: fields.result.mapValue.fields.type.stringValue,
//                 resultValue: fields.result.mapValue.fields.value.integerValue,
//                 isPrivate: fields.isPrivate.booleanValue,
//             }
//         }, [] as Record<string, any>[])

//         const { error: inserError } = await supabase.from('movement_results').insert(movement_results_data)
//         if (inserError) throw inserError

//         return movement_results_data.length
//     }

//     return 0
// }

// function mapWorkout(fields: any) {
//     return {
//         type: fields.type.stringValue,
//         config: mapConfig(fields.config),
//         rounds: fields.rounds.arrayValue.values.map(({ mapValue: { fields: round } }) => mapRound(round)),
//         info: fields.info?.stringValue || undefined,
//         name: fields.name?.stringValue || undefined,
//     }
// }

// function mapRound(round: any) {
//     const type = round.type?.stringValue

//     switch (type) {
//         case 'rest':
//             return { type: 'rest', time: round.time.integerValue }
//         case 'complex':
//         default:
//             return {
//                 type: type || undefined,
//                 config: mapConfig(round.config),
//                 movements: round.movements.arrayValue.values.map(() => {}),
//             }
//     }
// }

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/migrateFirebaseToSupabase' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

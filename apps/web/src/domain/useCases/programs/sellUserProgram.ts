import dayjs from 'dayjs'
import { ModelsInsert } from 'goal-models'

import { supabase } from '@common/providers/supabase'

export async function sellUserProgram(dataSell: Omit<ModelsInsert<'user_programs'>, 'expires_at'>) {
    if (!dataSell.program_id) throw new Error('ID do programa não encontrado')

    const { error: programError, data } = await supabase
        .from('programs')
        .select()
        .eq('id', dataSell.program_id)
        .single()
    if (programError) throw programError

    const expires_at = dayjs().add(data.expiration, 'days').toISOString()

    const { error } = await supabase.from('user_programs').insert({ ...dataSell, expires_at })
    if (error) throw error
}

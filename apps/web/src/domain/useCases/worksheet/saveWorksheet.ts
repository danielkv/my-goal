import dayjs from 'dayjs'
import { IDayInput, IWorksheet, IWorksheetInput } from 'goal-models'
import { diff, omit, sort } from 'radash'

import { supabase } from '@common/providers/supabase'

export async function saveWorksheetUseCase(worksheet: IWorksheetInput): Promise<IWorksheet> {
    const orderdDays = sort(worksheet.days, (item) => dayjs(item.date).unix())

    const { error, data } = await supabase
        .from('worksheets')
        .upsert(
            {
                ...omit(worksheet, ['days']),
                startDate: orderdDays.at(0)?.date || '',
                endDate: orderdDays.at(-1)?.date || '',
            },
            { onConflict: 'id', ignoreDuplicates: false }
        )
        .select()
        .single()
    if (error) throw error

    const hidratedDays = orderdDays.map<IDayInput>((day) => ({
        ...(day.id ? day : omit(day, ['id'])),
        worksheetId: data.id,
    }))

    if (worksheet.id) {
        const { error, data } = await supabase.from('days').select('id').eq('worksheetId', worksheet.id)
        if (error) throw error

        const deleteIds = diff(
            data.map((item) => item.id),
            hidratedDays.map((item) => item.id)
        )

        if (deleteIds.length) {
            const { error: errorDelete } = await supabase.from('days').delete().in('id', deleteIds)
            if (errorDelete) throw errorDelete
        }
    }

    const { error: daysError, data: insertedDays } = await supabase
        .from('days')
        .upsert(hidratedDays, { onConflict: 'id', ignoreDuplicates: false, defaultToNull: false })
        .select()
    if (daysError) throw daysError

    return { ...data, days: insertedDays }
}

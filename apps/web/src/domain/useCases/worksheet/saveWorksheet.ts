import { IDayInput, IWorksheet, IWorksheetInput } from 'goal-models'
import { omit } from 'radash'

import { supabase } from '@common/providers/supabase'

export async function saveWorksheetUseCase(worksheet: IWorksheetInput): Promise<IWorksheet> {
    const { error, data } = await supabase
        .from('worksheets')
        .upsert({
            ...omit(worksheet, ['days']),
            startDate: worksheet.days.at(0)?.date || '',
            endDate: worksheet.days.at(-1)?.date || '',
        })
        .select()
        .single()
    if (error) throw error

    const hidratedDays = worksheet.days.map<IDayInput>((day) => ({
        ...(day.id ? day : omit(day, ['id'])),
        worksheetId: data.id,
    }))

    const { error: removeDaysError } = await supabase.from('days').delete({ count: 'exact' }).eq('worksheetId', data.id)
    if (removeDaysError) throw removeDaysError

    const { error: daysError, data: insertedDays } = await supabase.from('days').insert(hidratedDays).select()
    if (daysError) throw daysError

    return { ...data, days: insertedDays }
}

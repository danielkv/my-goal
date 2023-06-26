import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(isBetween)
dayjs.extend(duration)
dayjs.locale('pt-br')

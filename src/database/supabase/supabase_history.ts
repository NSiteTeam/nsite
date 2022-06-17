import type { LongDate } from '@/utils/long_date'
import type { HistoryPoint } from '../interface/history_point'

export class SupabaseHistoryPoint implements HistoryPoint {
  id: number
  title: string
  date: LongDate
  content: string
  visible: boolean

  constructor(
    id: number,
    title: string,
    content: string,
    date: LongDate,
    visible: boolean,
  ) {
    this.id = id
    this.title = title
    this.content = content
    this.date = date
    this.visible = visible
  }
}

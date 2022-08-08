import type { LongDate } from '@/utils/long_date'
import type { HistoryPoint } from '../interface/history_point'

export class SupabaseHistoryPoint implements HistoryPoint {
  id: number
  title: string
  subtitle: string
  date: number
  content: string
  visible: boolean

  constructor(
    id: number,
    title: string,
    subtitle: string,
    content: string,
    date: number,
    visible: boolean,
  ) {
    this.id = id
    this.title = title
    this.subtitle = subtitle
    this.content = content
    this.date = date
    this.visible = visible
  }
}

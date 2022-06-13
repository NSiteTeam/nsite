import type { LongDate } from '@/utils/long_date'
import type { Level } from '../interface/level'
import type { News } from '../interface/news'

export class SupabaseNews implements News {
  id: number
  title: string
  content: string
  date: LongDate
  concerned: Array<Level>
  visible: boolean

  constructor(
    id: number,
    title: string,
    content: string,
    date: LongDate,
    concerned: Array<Level>,
    visible: boolean,
  ) {
    this.id = id
    this.title = title
    this.content = content
    this.date = date
    this.concerned = concerned
    this.visible = visible
  }
}

import type { LongDate } from '@/utils/long_date'
import type { Level } from '../interface/level'
import type { News } from '../interface/news'

export class SupabaseNews implements News {
  id: number
  title: string
  subtitle: string
  content: string
  date: LongDate
  concerned: Array<Level>
  visible: boolean
  imageUrls: string[]

  constructor(
    id: number,
    title: string,
    subtitle: string,
    content: string,
    date: LongDate,
    concerned: Array<Level>,
    visible: boolean,
    imageUrls: string[],
  ) {
    this.id = id
    this.title = title
    this.subtitle = subtitle
    this.content = content
    this.date = date
    this.concerned = concerned
    this.visible = visible
    this.imageUrls = imageUrls
  }
}

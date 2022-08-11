import type { HistoryPoint } from '../interface/history_point'

export class SupabaseHistoryPoint implements HistoryPoint {
  id: number
  title: string
  subtitle: string
  date: number
  content: string
  imageUrls: string[]
  visible: boolean

  constructor(
    id: number,
    title: string,
    subtitle: string,
    content: string,
    date: number,
    visible: boolean,
    imageUrls: string[],
  ) {
    this.id = id
    this.title = title
    this.subtitle = subtitle
    this.content = content
    this.imageUrls = imageUrls
    this.date = date
    this.visible = visible
  }
}

import type { ImageWithLabel } from './../interface/image_with_label'
import type { HistoryPoint } from '../interface/history_point'

export class SupabaseHistoryPoint implements HistoryPoint {
  id: number
  title: string
  subtitle: string
  date: number
  content: string
  images: ImageWithLabel[]
  visible: boolean

  constructor(
    id: number,
    title: string,
    subtitle: string,
    content: string,
    date: number,
    visible: boolean,
    imageUrls: ImageWithLabel[],
  ) {
    this.id = id
    this.title = title
    this.subtitle = subtitle
    this.content = content
    this.images = imageUrls
    this.date = date
    this.visible = visible
  }
}

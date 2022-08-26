import type { LongDate } from '@/utils/long_date'
import type { ImageWithLabel } from './image_with_label'
import type { Level } from './level'

export interface News {
  id: number
  title: string
  subtitle: string
  content: string
  date: LongDate
  concerned: Array<Level>
  visible: boolean
  images: ImageWithLabel[]
}

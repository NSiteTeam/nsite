import type { ImageWithLabel } from './image_with_label'
export interface HistoryPoint {
  id: number
  title: string
  subtitle: string
  date: number
  content: string
  images: ImageWithLabel[]
  visible: boolean
}

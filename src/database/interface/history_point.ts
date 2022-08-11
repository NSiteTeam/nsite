import type { LongDate } from '@/utils/long_date'

export interface HistoryPoint {
  id: number
  title: string
  subtitle: string
  date: number
  content: string
  imageUrls: string[]
  visible: boolean
}

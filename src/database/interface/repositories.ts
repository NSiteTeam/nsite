import type { Level } from './level'

export interface Repository {
  id: number
  title: string
  level: Level
  publication_date: string
  owners: string[]
  description: string
  content: Array<number>
}

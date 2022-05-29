import type { Level } from "./level"

export interface News {
    id: number
    title: string
    subtitle: string
    date: string
    concerned: Array<Level> | null
}

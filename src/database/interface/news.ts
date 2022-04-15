import type { Level } from "./level"

export interface News {
    title: string
    subtitle: string
    date: string
    concerned: Array<Level>
}

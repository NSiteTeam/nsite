import type { Level } from "../interface/level"
import type { News } from "../interface/news"

export class SupabaseNews implements News {
    id: number
    title: string
    subtitle: string
    date: string
    concerned: Array<Level> | null

    constructor(id: number, title: string, subtitle: string, date: string, concerned: Array<Level> | null) {
        this.id = id
        this.title = title
        this.subtitle = subtitle
        this.date = date
        this.concerned = concerned
    }
}

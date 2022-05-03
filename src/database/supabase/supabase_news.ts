import type { Level } from "../interface/level"
import type { News } from "../interface/news"

export class SupabaseNews implements News {
    title: string
    subtitle: string
    date: string
    concerned: Array<Level>

    constructor(title: string, subtitle: string, date: string, concerned: Array<Level>) {
        this.title = title
        this.subtitle = subtitle
        this.date = date
        this.concerned = concerned
    }
}

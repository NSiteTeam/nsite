import type { HistoryPoint } from "../interface/history_point"

export class SupabaseHistory implements HistoryPoint {
    title: string
    date: string
    content: string

    constructor(title: string, content: string, date: string) {
        this.title = title
        this.content = content
        this.date = date
    }
}

import type { History } from "../interface/history"

export class SupabaseHistory implements History {
    title: string
    date: string
    content: string

    constructor(title: string, content: string, date: string) {
        this.title = title
        this.content = content
        this.date = date
    }
}
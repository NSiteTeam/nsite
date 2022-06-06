import type { Level } from "../interface/level"
import type { Repository } from "../interface/repositories"

export class SupabaseRepository implements Repository {
    title: string
    level: Level
    publication_date: string
    description: string
    id: number
    content: Array<number>

    constructor(
        id: number,
        title: string,
        level: Level,
        publication_date: string,
        description: string,
        content: Array<number>
    ) {
        this.id = id
        this.title = title
        this.level = level
        this.publication_date = publication_date
        this.description = description
        this.content = content
    }
}

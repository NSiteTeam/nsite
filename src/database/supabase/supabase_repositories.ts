import type { Repository } from "../interface/repositories"

export class SupabaseRepository implements Repository {
    title: string
    level: number
    publication_date: string
    description: string
    image: string
    content: Array<number | string>

    constructor(title: string, level: number, publication_date: string,
        description: string, image: string, content: Array<number | string>) {
        this.title = title
        this.level = level
        this.publication_date = publication_date
        this.description = description
        this.image = image
        this.content = content
    }
}
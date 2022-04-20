import type { Repository } from "../interface/repositories"

export class SupabaseHistory implements Repository {
    title: string
    level: number
    publication_date: string
    description: string
    image: string
    content: object

    constructor(title: string, level: number, publication_date: string,
        description: string, image: string, content: object) {
        this.title = title
        this.level = level
        this.publication_date = publication_date
        this.description = description
        this.image = image
        this.content = content
    }
}
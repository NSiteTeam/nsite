export interface Repository {
    id: number
    title: string
    level: number
    publication_date: string
    description: string
    content: Array<number | string>
}

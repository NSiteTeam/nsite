import type date from "@/utils/interface/date";
import type Message from "../interface/message";

export default class SupabaseMessage implements Message {
    id: number
    content: string
    author: string
    date: date

    constructor(content: string, author: string, date: date, id: number) {
        this.id = id
        this.content = content
        this.author = author
        this.date = date
    }
}
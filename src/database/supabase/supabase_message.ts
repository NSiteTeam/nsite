import type Message from '../interface/message'

export default class SupabaseMessage implements Message {
  id: number
  content: string
  author: string | null
  date: string

  constructor(
    content: string,
    author: string | null,
    date: string,
    id: number,
  ) {
    this.id = id
    this.content = content
    this.author = author
    this.date = date
  }
}

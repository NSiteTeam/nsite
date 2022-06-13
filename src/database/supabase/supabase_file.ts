import type CustomFile from '../interface/file'

export default class SupabaseFile implements CustomFile {
  id: number
  name: string
  icon: string
  date: string
  file_url: string
  last_commit_author: string
  last_commit_text: string

  constructor(
    id: number,
    name: string,
    icon: string,
    date: string,
    last_commit_author: string,
    last_commit_text: string,
    file_url: string,
  ) {
    this.id = id
    this.name = name
    this.icon = icon
    this.date = date
    this.last_commit_author = last_commit_author
    this.last_commit_text = last_commit_text
    this.file_url = file_url
  }
}

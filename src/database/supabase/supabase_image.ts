import type { ImageWithLabel } from '../interface/image_with_label'

export class SupabaseImage implements ImageWithLabel {
  id: number
  url: string
  label: string

  constructor(
    id: number,
    url: string,
    label: string,
  ) {
    this.id = id
    this.url = url
    this.label = label
  }
}

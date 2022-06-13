import type { Level } from "../interface/level";
import type { Repository } from "../interface/repositories";

export class SupabaseRepository implements Repository {
  title: string;
  level: Level;
  publication_date: string;
  description: string;
  owners: string[];
  id: number;
  content: Array<number>;

  constructor(
    id: number,
    title: string,
    level: Level,
    publication_date: string,
    description: string,
    content: Array<number>,
    owners: string[]
  ) {
    this.id = id;
    this.title = title;
    this.level = level;
    this.owners = owners;
    this.publication_date = publication_date;
    this.description = description;
    this.content = content;
  }
}

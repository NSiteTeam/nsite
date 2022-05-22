import type { Username } from "../interface/username"
import type { User } from "../interface/user"

export class SupabaseUsername implements Username {
    id: number
    username: string
    user: string

    constructor(id: number, username: string, user: string) {
            this.username = username
            this.user = user
            this.id = id
    }
}

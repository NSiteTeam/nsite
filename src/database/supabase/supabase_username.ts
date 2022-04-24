import type { Username } from "../interface/username"
import type { User } from "../interface/user"

export class SupabaseUsername implements Username {
    id: number
    username: string
    user: User

    constructor(id: number, username: string, user: User) {
            this.username = username
            this.user = user
            this.id = id
    }
}
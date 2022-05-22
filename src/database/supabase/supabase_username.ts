import type { Username } from "../interface/username"
import type { User } from "../interface/user"

export class SupabaseUsername implements Username {
    username: string
    user: string

    constructor(username: string, user: string) {
            this.username = username
            this.user = user
    }
}

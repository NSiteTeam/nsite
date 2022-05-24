export interface RoleInterface{
    uuid: string
    role: Array<number>
}

export class SupabaseRole implements RoleInterface {
    uuid: string
    role: Array<number>

    constructor(uuid: string, role: Array<number>) {
            this.uuid = uuid
            this.role = role
    }
}
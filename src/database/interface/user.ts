import type { Permission } from "./permissions"

export interface User {
    readonly email: email
    readonly username: username
    readonly uuid: uuid
    readonly permissions: Permission[]
}

export type username = string
export type email = string
export type uuid = string

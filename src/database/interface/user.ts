import type { Permission } from './permissions'

export type username = string // Unused for the moment
export type email = string
export type password = string
export type uuid = string

/**
 * Some data about an user
 * @property email the email of the user
 * @property uuid the uuid of the user
 */
export interface User {
  email: email
  uuid: uuid

  /**
   * Fetches the permissions of the user.
   *
   * It's a good idea to cache the permissions of the user, so that we
   * don't have to fetch them again.
   *
   * @returns the permissions of the user
   *
   * @throws if the permissions couldn't be fetched
   */
  getPermissions(): Promise<Permission[]>

  /**
   * Fetches the username of the user.
   *
   * It's a good idea to cache the username of the user, so that we
   * don't have to fetch it again.
   *
   * @returns the username of the user
   *
   * @throws if the username couldn't be fetched
   */
  getUsername(): Promise<string>
}

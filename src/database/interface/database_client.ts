import type { Ref } from 'vue'
import type { News } from './news'
import type { Permission } from './permissions'
import type { HistoryPoint } from './history_point'
import type { Repository } from './repositories'
import type CustomFile from './file'
import type Message from './message'
import type { User, email, password, username } from './user'
import type { Level } from './level'
import type {
  SchoolProgram,
  Theme,
  ThemeResource,
  ThemeResourceFile,
  ThemeResourceType,
} from './school_program'
import type { PreviewData } from './preview_data'

export type errorMessage = string

export interface DatabaseClient {
  /**
   * USER SECTION
   */

  isConnected: Ref<boolean>
  user: Ref<User | null>

  /**
   * Fetch on the server the permissions of the current user.
   * They are also always verified server-side.
   * We consider that an unauthenticated user has no permissions (empty array).
   *
   * It's recommended to the implementation to fetch the permissions on the login and cache them.
   *
   * @return the permissions of the current user.
   */
  getPermissions(): Promise<Permission[]>

  /**
   * Return the levels that user can edit ONLY if he has the TEACHER permission
   *
   * @return an array of levels
   */
  getTeachingLevels(): Promise<Level[]>

  /**
   * Sign in the user with the given email and password
   * @param email the email of the user
   * @param password the password of the user
   */
  register(email: email, password: password): Promise<void>

  /**
   * Login the user with the given email and password
   * @param email The email of the user
   * @param password The password of the user
   */
  login(email: email, password: password): Promise<void>

  /**
   * Logout the user
   *
   * @returns An error message if the logout failed, null otherwise
   */
  logout(): Promise<void>

  /**
   * SCHOOL PROGRAM SECTION
   */

  /**
   * Get the school program in mathematics that is visible by the students.
   *
   * @returns The school program
   */
  getProgram(): Promise<SchoolProgram>

  /**
   * Get all the school program, including invisible themes which are in the
   * teachers teaching levels.
   */
  getAllProgram(): Promise<SchoolProgram>

  /**
   * Get the theme of the given uuid
   *
   * @param uuid The uuid of the theme
   * @returns The theme or null if it doesn't exist
   */
  getThemeByUuid(uuid: string): Promise<Theme | null>

  /**
   * Get all the resources linked to the given theme
   *
   * @param uuid The uuid of the theme
   * @returns The resources of the theme or null if it doesn't exist
   */
  getThemeResources(uuid: string): Promise<ThemeResource[] | null>

  /**
   * Compute the preview of the given website on the server
   *
   * @param url The url of the website
   * @returns The preview of the file
   */
  getPreviewDataOfURL(url: string): Promise<PreviewData>

  // MANAGE PROGRAM

  /**
   * Create a new, invisible theme
   *
   * @param name The name of the theme
   * @param description The description of the theme
   * @param level The level of which the theme is related
   */
  createTheme(name: string, description: string, level: Level): Promise<Theme>

  /**
   * Update the given theme
   *
   * @param uuid The uuid of the theme to update
   * @param newTheme The new data of the theme
   *
   * @returns The updated theme
   */
  updateTheme(uuid: string, newTheme: Theme): Promise<Theme>

  /**
   * Delete the given theme
   *
   * @param uuid The uuid of the theme to delete
   * @returns The deleted theme
   */
  deleteTheme(uuid: string): Promise<void>

  /**
   * Get all the type of resources in the database
   *
   * @returns The types of resources
   */
  getThemeResourceTypes(): Promise<ThemeResourceType[]>

  /**
   * Create a new, visible resource linked to the given theme
   *
   * @param uuid The uuid of the theme
   * @param name The name of the resource
   * @param message The message of the resource
   * @param type The type of the resource
   * @param corected If the resource come with a correction
   * @param files The files or url of resources. Url are not uploaded to the server, they are just stored in the database.
   */
  createThemeResource(
    theme_uuid: string,
    name: string,
    message: string,
    type: string,
    corrected: boolean,
    files: ThemeResourceFile[],
  ): Promise<ThemeResource>

  /**
   * Update the given resource
   *
   * @param uuid The uuid of the resource to update
   * @param newResource The new data of the resource
   * @param files The files or url of resources. The client send and remove only the files that have changed.
   *
   * @returns The updated resource
   */
  updateThemeResource(
    theme_uuid: string,
    resource_uuid: string,
    name: string,
    message: string,
    type: string,
    corrected: boolean,
    files: ThemeResourceFile[],
  ): Promise<ThemeResource>

  /**
   * Change the visibility of the given resource.
   *
   * @param uuid The uuid of the resource to change
   * @param visible If the resource will be visible or not
   */
  changeThemeResourceVisibility(
    theme_uuid: string,
    resource_uuid: string,
    visible: boolean,
  ): Promise<void>

  /**
   * Delete the given resource
   *
   * @param uuid The uuid of the resource to delete
   * @returns The deleted resource
   */
  deleteThemeResource(theme_uuid: string, resource_uuid: string): Promise<void>

  // Deposits
  uploadFileToDeposit(
    file: File,
    deposit: string,
    message: string,
    fileName?: string,
  ): Promise<string>
  editDeposit(
    id: number,
    title: string,
    description: string,
    level: number,
  ): Promise<string>
  deleteDeposit(id: number): Promise<string | void>
  deleteFile(id: number): Promise<any>
  postDeposit(title: string, level: Level, description: string): Promise<void>
  renameFile(id: number, newName: string, newMessage: string): Promise<any>
  getDeposits(id?: number): Promise<Repository[]>
  getOwnedDeposits(): Promise<Repository[]>
  getDeposit(id: number): Promise<Repository | null>
  getFile(id: number): Promise<CustomFile>
  repositories: Ref<Repository[]>
  files: Ref<CustomFile[]>

  // Messages
  fetchMessages(repoId: number): Promise<Message[]>
  postMessage(content: string, depoId: number): Promise<Message[]>
  fetchMessages(repoId: number): Promise<Message[]>
  watchMessages(depoId: number): void
  deleteMessageInTheCache(messageId: number): void
  deleteMessage(messageId: number): void
  editMessage(messageId: number, newContent: string): void
  clearMessages(): void
  fetchedMessages: Ref<Message[]>

  // NEWS
  fetchedNews: Ref<Array<News>>
  numberOfNews: Ref<number>
  fetchNews(quantity: number, onlyVisible: boolean): Promise<void>
  createEmptyNews(title: string): Promise<News>
  updateNews(news: News): Promise<errorMessage | null>
  switchVisibilityOfHistoryPoint(news: News): Promise<errorMessage | null>
  deleteNews(news: News): Promise<errorMessage | null>

  // TIMELINE
  createEmptyHistoryPoint(title: string): Promise<HistoryPoint>
  updateHistoryPoint(historyPoint: HistoryPoint): Promise<errorMessage | null>
  switchVisibilityOfHistoryPoint(
    historyPoint: HistoryPoint,
  ): Promise<errorMessage | null>
  deleteHistoryPoint(news: HistoryPoint): Promise<errorMessage | null>
  fetchHistoryPoints(): Promise<void>
  fetchOneHistoryPoint(id: number): Promise<HistoryPoint | undefined>
  fetchedHistoryPoints: Ref<HistoryPoint[]>
}

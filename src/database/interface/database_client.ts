import type { Ref } from 'vue'
import type { News } from './news'
import type { Permission } from './permissions'
import type { HistoryPoint } from './history_point'
import type { Repository } from './repositories'
import type CustomFile from './file'
import type Message from './message'
import type { User, email, password, username } from './user'
import type { Level } from './level'
import type { SchoolProgram, Theme, ThemeResource } from './school_program'
import type { PreviewData } from './preview_data'

export type errorMessage = string

export interface DatabaseClient {

  /**
   * USER SECTION
   */

  isConnected: Ref<boolean>
  user: Ref<User | null>

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
   * Get the school program in mathematics.
   *
   * @returns The school program
   *
   * It's recommended for the implementation to cache the program.
   */
  getProgram(): Promise<SchoolProgram>

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
  fetchNews(quantity: number, visibility?: boolean): Promise<number>
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
  fetchedHistoryPoints: Ref<HistoryPoint[]>
}

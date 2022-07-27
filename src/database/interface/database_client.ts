import type { Ref } from 'vue'
import type { News } from './news'
import type { HistoryPoint } from './history_point'
import type { Repository } from './repositories'
import type CustomFile from './file'
import type Message from './message'
import type { User } from './user'
import type { Level } from './level'

export type errorMessage = string

export interface DatabaseClient {
  // USER
  isConnected: Ref<boolean>
  unverifiedEmail: Ref<string | undefined>
  user: Ref<User | null>

  changePasswordUsingToken(token: string, newPassword: string): Promise<boolean>
  changePassword(oldPassword: string, newPassword: string): Promise<any>
  signIn(email: string, password: string, username: string): any
  recoverPassword(email: string): Promise<boolean>
  checkOTP(OTPcode: string): Promise<boolean>
  getAllUsers(quantity?: number): Promise<any>
  login(email: string, password: string): any
  getUsername(uuid: string): Promise<string>
  logout(): Promise<boolean>

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
  fetchNews(quantity: number, visibility?: boolean): Promise<void>
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

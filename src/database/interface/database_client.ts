import type { Ref } from 'vue';
import type { News } from './news';
import type { Permission } from './permissions';
import type { HistoryPoint } from './history_point';
import type { Repository } from './repositories';
import type CustomFile from './file';
import type Message from './message';
import type { User } from './user';
import type { Level } from './level';

export type errorMessage = string

export interface DatabaseClient {
    // USER
    isConnected: Ref<boolean>
    user: Ref<User | null>

    signIn(email: string, password: string, username: string): any
    login(email: string, password: string): any
    getUsername(uuid: string): Promise<string>
    logout(): Promise<boolean>

    // Deposits
    uploadFileToDeposit(file: File, deposit: string, message: string, fileName?: string): Promise<string>
    postDeposit(title: string, level: Level, description: string) : Promise<void>
    renameFile(id: number, newName: string, newMessage: string): Promise<any>
    getDeposits(id?: number): Promise<Repository[]>
    getOwnedDeposits(): Promise<Repository[]>
    getDeposit(id: number): Promise<Repository | null>
    getFile(id: number): Promise<CustomFile>
    editDeposit(id: number, title: string, description: string, level: number): Promise<string>
    repositories: Ref<Repository[]>
    files: Ref<CustomFile[]>

    // Messages
    fetchMessages(repoId: number): Promise<Message[]>
    postMessage(author: string | null, content: string, depoId: number): Promise<Message[]>
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
    fetchNews(quantity: number): Promise<void>
    createEmptyNews(title: string): Promise<News>
    updateNews(news: News): Promise<errorMessage | null>
    switchVisibility(news: News): Promise<errorMessage | null>
    deleteNews(news: News): Promise<errorMessage | null>

    // TIMELINE
    postHistotyPoint(title: string, content: string, date: string) : Promise<void>
    getHistoryPoints(): Promise<Array<HistoryPoint>>
    fetchedHistory: Array<HistoryPoint>
}

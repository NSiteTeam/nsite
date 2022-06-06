import type { Ref } from 'vue';
import type { News } from './news';
import type { Permission } from './permissions';
import type { HistoryPoint } from './history_point';
import type { Repository } from './repositories';
import type CustomFile from './file';
import type Message from './message';
import type { User } from './user';

export interface DatabaseClient {
    // USER
    isConnected: Ref<boolean>
    user: Ref<User | null>
    accountCreationDate: Ref<string | null>

    signIn(email: string, password: string, username: string): any
    login(email: string, password: string): any
    logout(): any

    // Deposits
    uploadFileToDeposit(file: File, deposit: string, message: string): Promise<string>
    postDeposit(title: string, level: number, description: string) : Promise<void>
    renameFile(id: number, newName: string, newMessage: string): Promise<any>
    getRepos(id?: number): Promise<Repository[]>
    getOwnedDeposits(): Promise<Repository[]>
    getFile(id: number): Promise<CustomFile>
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
    maxNewsReached: Ref<boolean>
    fetchNews(quantity: number): Promise<void>
    postNews(title: string, content: string) : Promise<void>
    editNews(id:number, title: string, content: string): Promise<string>
    editDepo(id: number, title: string, description: string, level: number): Promise<string>

    // TIMELINE
    postHistotyPoint(title: string, content: string, date: string) : Promise<void>
    getHistoryPoints(): Promise<Array<HistoryPoint>>
    fetchedHistory: Array<HistoryPoint>
}

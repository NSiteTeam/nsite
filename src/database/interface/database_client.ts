import type { Ref } from 'vue';
import type { News } from './news';
import type { Permission } from './permissions';
import type { HistoryPoint } from './history_point';
import type { Repository } from './repositories';
import type CustomFile from './file';
import type Message from './message';

export interface DatabaseClient {
    // USER
    isConnected: Ref<boolean>
    permissions: Ref<Array<Permission>>
    email: Ref<string | null>
    uuid: Ref<string | null>
    last_date: Ref<string | null>
    first_date: Ref<string | null>
    getUsername(uuid: string): Promise<any>
    getRole(uuid: string): Promise<any>

    signIn(email: string, password: string): any
    login(email: string, password: string): any
    logout(): any

    // Repositories
    postDeposit(title: string, level: string, description: string) : Promise<void>
    getRepos(id?: number): Promise<Repository[]>
    getFile(id: number): Promise<CustomFile>
    repositories: Ref<Repository[]>
    files: Ref<CustomFile[]>
    uploadFileToDeposit(file: File, deposit: string, message: string): Promise<string>

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

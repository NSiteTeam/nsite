import type { Ref } from 'vue';
import type { News } from './news';
import type { Permission } from './permissions';
import type { HistoryPoint } from './history_point';
import type { Repository } from './repositories';
import type File from './file';
import type Message from './message';

export interface DatabaseClient {
    // USER
    isConnected: Ref<boolean>
    permissions: Ref<Array<Permission>>
    email: Ref<string | null>
    uuid: Ref<string | null>
    getUsername(id?: number): Promise<any>

    signIn(email: string, password: string): any
    login(email: string, password: string): any
    logout(): any

    // Repositories
    getRepos(id?: number): Promise<Repository[]>
    getFile(id: number): Promise<File>
    clearFiles(): void
    repositories: Ref<Repository[]>
    files: Ref<File[]>

    // Messages
    fetchMessages(repoId: number): Promise<Message[]>
    postMessage(date: string, author: string | null, content: string, depoId: number): Promise<Message[]>
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

    // TIMELINE
    getHistoryPoints(): Promise<Array<HistoryPoint>>
    fetchedHistory: Array<HistoryPoint>
}

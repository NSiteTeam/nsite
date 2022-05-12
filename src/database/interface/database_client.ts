import type { Ref } from 'vue';
import type { News } from './news';
import type { Permission } from './permissions';
import type { HistoryPoint } from './history_point';
import type { Repository } from './repositories';

export interface DatabaseClient {
    // USER
    isConnected: Ref<boolean>
    permissions: Ref<Array<Permission>>
    email: Ref<string | null>
    uuid: Ref<string | null>
    getUsername(id?: number): Promise<any>

    signIn(email: string, password: string): any
    login(email: string, password: string): any

    // Repositories
    getRepos(id?: number): Promise<Repository[]>
    dataRef: Ref<Repository[]>

    // NEWS
    fetchedNews: Ref<Array<News>>
    maxNewsReached: Ref<boolean>
    fetchNews(quantity: number): Promise<void>

    // TIMELINE
    getHistoryPoints(): Promise<Array<HistoryPoint>>
    fetchedHistory: Array<HistoryPoint>
}

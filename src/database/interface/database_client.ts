import type { Ref } from 'vue';
import type { News } from './news';
import type { Permission } from './permissions';

export interface DatabaseClient {
    // USER
    isConnected: Ref<boolean>
    permissions: Ref<Array<Permission>>
    email: Ref<string | null>

    signIn(email: string, password: string): any
    login(email: string, password: string): any

    // NEWS
    fetchedNews: Array<News>
    fetchNews(quantity: number): Promise<void>
}

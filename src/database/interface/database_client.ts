import type { Ref } from 'vue';

export interface DatabaseClient {
    isConnected: Ref<boolean>
    permissions: Ref<Array<Permissions>>
    email: Ref<string | null>

    signIn(email: string, password: string): any
    login(email: string, password: string): any
}

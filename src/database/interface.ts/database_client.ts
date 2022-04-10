import type { Ref } from 'vue';

export interface DatabaseClient {
    isConnected: Ref<boolean>
    email(): string | null

    signIn(email: string, password: string): any
    login(email: string, password: string): any
}

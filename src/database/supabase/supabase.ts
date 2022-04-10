import { createClient } from '@supabase/supabase-js'
import { ref, type Ref } from 'vue'
import type { DatabaseClient } from '../interface.ts/database_client'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const supabase = createClient(supabaseUrl, supabaseAnonKey)


export class SupabaseClient implements DatabaseClient {
    isConnected: Ref<boolean> = ref(false)

    email(): string | null {
        return supabase.auth.user()?.email ?? null
    }

    async signIn(email: string, password: string): Promise<any> {
        console.log("Try to sign in with email: " + email)

        const { user, session, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })

        this.isConnected.value = !error && user != null // TODO: As there is email confirmation, user can have a value but session can be null
        console.log("Connection status:", this.isConnected.value)
        return this.isConnected.value
    }

    async login(email: string, password: string): Promise<boolean> {
        console.log("Try to login with email: " + email)

        const { user, session, error } = await supabase.auth.signIn({
            email: email,
            password: password
        })

        this.isConnected.value = !error && user != null

        console.log("Connection status:", this.isConnected.value)

        return this.isConnected.value
    }
}

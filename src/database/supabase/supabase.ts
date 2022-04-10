import { createClient } from '@supabase/supabase-js'
import { ref, type Ref } from 'vue'
import type { DatabaseClient } from '../interface.ts/database_client'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export class SupabaseClient implements DatabaseClient {
    /**
     * The value of this ref is true if the user is connected to the database
     */
    isConnected: Ref<boolean> = ref(false)

    /**
     * Return the email of the connected user or null if the user is not connected
     */
    email(): string | null {
        return supabase.auth.user()?.email ?? null
    }

    /**
     * Sign in the user with the given email and password
     * @param email the email of the user
     * @param password the password of the user
     * @returns if the account was created or not. The return can be true even if the email is not yet verified
     */
    async signIn(email: string, password: string): Promise<any> {
        console.log("Try to sign in with email: ", email)

        const { user, session, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })

        const accountCreated = !error && user != null // Here the account exists, but the email is not verified yet
        console.log("Account created:", accountCreated)
        return accountCreated
    }

    /**
     * Login the user with the given email and password
     * @param email The email of the user
     * @param password The password of the user
     * @returns If the login was successful or not
     */
    async login(email: string, password: string): Promise<boolean> {
        console.log("Try to login with email: ", email)

        const { user, session, error } = await supabase.auth.signIn({
            email: email,
            password: password
        })

        this.isConnected.value = !error && user != null

        console.log("Connection status:", this.isConnected.value)

        return this.isConnected.value
    }
}

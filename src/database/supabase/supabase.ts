import { createClient } from '@supabase/supabase-js'
import { ref, type Ref } from 'vue'
import type { DatabaseClient } from '../interface/database_client'
import { Permissions } from '../interface/permissions'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export class SupabaseClient implements DatabaseClient {
    /**
     * The value of this ref is true if the user is connected to the database
     */
    isConnected: Ref<boolean> = ref(false)

    /**
     * The email of the connected user or null if the user is not connected
     */
    email: Ref<string | null> = ref(null)

    /**
     * All the permissions of the user
     */
    permissions: Ref<Array<Permissions>> = ref(Array())

    /**
     * Sign in the user with the given email and password
     * @param email the email of the user
     * @param password the password of the user
     * @returns if the account was created or not. The return can be true even if the email is not yet verified
     */
    async signIn(email: string, password: string): Promise<any> {
        console.log("Try to sign in with email: ", email)

        const { user, error } = await supabase.auth.signUp({
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

        await supabase.auth.signIn({
            email: email,
            password: password
        })

        this.updateUserInfos()

        console.log("Connection status:", this.isConnected.value)

        return this.isConnected.value
    }

    private async updateUserInfos() {
        this.isConnected.value = supabase.auth.session() != null
        this.email.value = supabase.auth.user()?.email ?? null
        await supabase.functions.invoke('fetch-permissions')
            .then(result => {
                this.permissions.value = (result['data'] as unknown as Array<Number>).map(e => Object.values(Permissions)[e])
            })
            .catch(error => {
                console.log("Error while fetching permissions", error)
            })

        console.log(
            `Just updated user infos:\n` +
            ` - User is connected: ${this.isConnected.value}\n` +
            ` - User's email : ${this.email.value}\n` +
            ` - User's permissions: ${this.permissions.value}`
        )
    }
}

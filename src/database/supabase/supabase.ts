import { createClient } from '@supabase/supabase-js'
import { ref, type Ref } from 'vue'
import type { DatabaseClient } from '../interface/database_client'
import { Level } from '../interface/level'
import type { News } from '../interface/news'
import type { HistoryPoint } from '../interface/history'
import { Permission } from '../interface/permissions'
import { SupabaseNews } from './supabase_news'
import { SupabaseRepository } from './supabase_repositories'
import { SupabaseHistory } from './supabase_history'
import type { Repository } from '../interface/repositories'

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
    permissions: Ref<Array<Permission>> = ref(Array())

    /**
     * A list of news fetched from the database.
     * This list is updated when the method fetchNews(quantity) is called
     */
    fetchedNews: Array<News> = []
    private newsOffset: number = 0

    /**
     * A list of history points fetched from the database
     */
    fetchedHistory: Array<HistoryPoint> = []

    /**
     * A list of history points fetched from the database
     */
    fetchedRepositories: Array<Repository> = []

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
                // @ts-ignore
                this.permissions.value = (result['data'] as unknown as Array<Number>).map(e => Object.values(Permission)[e])
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

    async fetchNews(quantity: number): Promise<void> {
        console.log(`Try to fetch ${quantity} news from ${this.newsOffset}`)

        return await supabase.functions.invoke('fetch-news', { body: JSON.stringify({ quantity: quantity, offset: this.newsOffset }) })
            .then(result => {
                this.newsOffset += quantity
                this.fetchedNews = (result['data'] as Array<any>).map(news => {
                    return new SupabaseNews(
                        news['title'],
                        news['subtitle'],
                        news['date'],
                        news['concerned'].map((level: number) => Object.values(Level)[level])
                    )
                })
                console.log(`Just fetched ${this.fetchedNews.length} news`)
            })
            .catch(error => {
                console.log("Error while fetching news", error)
            })

    }

    async getTimeline(callback: Function): Promise<any> {
        const { data, error } = await supabase.from('history_points').select()
        console.log(data)
        
        // @ts-ignore
        return callback(data.map(history => {
                    return new SupabaseHistory(
                        history['title'],
                        history['content'],
                        history['date'],
                    )
                }))
    }

    async getRepos(callback: Function): Promise<any> {
        const { data, error } = await supabase.from('deposits').select()
        
        // @ts-ignore
        return callback(data.map(repositories => {
                    return new SupabaseRepository(
                        repositories['id'],
                        repositories['title'],
                        repositories['level'],
                        repositories['creation_date'],
                        repositories['description'],
                        repositories['image_link'],
                        repositories['content'],
                    )
                }))
    }
}

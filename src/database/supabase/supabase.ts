import { createClient } from '@supabase/supabase-js'
import { ref, type Ref } from 'vue'
import type { DatabaseClient } from '../interface/database_client'
import { Level } from '../interface/level'
import type { News } from '../interface/news'
import type { HistoryPoint } from '../interface/history_point'
import { Permission } from '../interface/permissions'
import { SupabaseNews } from './supabase_news'
import { SupabaseRepository } from './supabase_repositories'
import { SupabaseUsername } from './supabase_username'
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
    fetchedNews: Ref<Array<News>> = ref(Array())
    private newsOffset: number = 0
    maxNewsReached: Ref<boolean> = ref(false)

    /**
     * A list of history points fetched from the database
     */
    fetchedHistory: Array<HistoryPoint> = []

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

        await this.updateUserInfos()

        console.log("Connection status:", this.isConnected.value)

        return this.isConnected.value
    }

    /**
     * Private method to update the data of the user. For the moment it updates :
     *  - Connection status
     *  - User email
     *  - User permissions (always verified server-side)
     */
    private async updateUserInfos() {
        console.log("Try to update user infos")

        this.isConnected.value = supabase.auth.session() != null

        this.email.value = supabase.auth.user()?.email ?? null

        await supabase.functions.invoke('fetch-permissions')
            .then(result => {
                try {
                    this.permissions.value = (result['data'] as unknown as Array<number>).map(e => Object.values(Permission)[e])
                } catch (error) {
                    console.log("Error while updating permissions, probably caused by changes in the database", error)
                }
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

    /**
     * Add more new to the fetchedNews property
     *
     * @param quantity the quantity of new to fetch
     */
    async fetchNews(quantity: number): Promise<void> {
        console.log(`Try to fetch ${quantity} news from ${this.newsOffset}`)

        return await supabase.functions.invoke('fetch-news', { body: JSON.stringify({ quantity: quantity, offset: this.newsOffset }) })
            .then(result => {
                const { news: array, maxNewsReached } = result['data']

                try {
                    array.forEach((news: any) => {
                        this.fetchedNews.value.push(new SupabaseNews(
                            news['title'],
                            news['subtitle'],
                            news['date'],
                            news['concerned'].map((level: number) => Object.values(Level)[level])
                        ))
                    })
                } catch (error) {
                    console.log("Error while updating permissions, probably caused by changes in the database", error)
                }

                this.newsOffset += quantity
                this.maxNewsReached.value = maxNewsReached

                console.log(`Just fetched ${array.length} news`)
                if (maxNewsReached) {
                    console.log("Max news reached")
                }
            })
            .catch(error => {
                console.log("Error while fetching news", error)
            })

    }

    async getHistoryPoints(): Promise<any> {
        console.log("Trying to fetch history points in the database")

        // Here we can directly manipulate the database as history points are public
        const { data, error } = await supabase
                                    .from('history_points')
                                    .select()

        if (data == null) {
            console.log('No data fetched')
            return
        }

        return new Promise((resolve, reject) => {
            if (!error && data != null) {
                resolve(
                    data.map(history => {
                        return new SupabaseHistory(
                            history['title'],
                            history['content'],
                            history['date'],
                        )})
                )
            } else {
                if (error) {
                    reject("Error while fetching history points" + error)
                } else if (data == null) {
                    reject("No data fetched")
                }
            }
        })
    }

    async getRepos(): Promise<any> {
        console.log("Trying to fetch deposits in the database")

        // Here we can directly manipulate the database as deposits are public
        const { data, error } = await supabase.from('deposits').select()

        if (error) {
            console.log("Error while fetching deposits", error)
        }

        if (data == null) {
            console.log('No data fetched')
            return
        }

        try {
            return data.map(repositories => {
                return new SupabaseRepository(
                    repositories['id'],
                    repositories['title'],
                    repositories['level'],
                    repositories['creation_date'],
                    repositories['description'],
                    repositories['image_link'],
                    repositories['content'],
                )
            })
        } catch (error) {
            console.log("Error while fetching deposits, probably caused by changes in the database", error)
        }
    }

    async getUsernames(): Promise<any> {
        // TODO: WE SHOULD NEVER EXPOSE ALL USER NAMES, REPLACE THIS BY A FUNCTION !!!!
        const { data, error } = await supabase.from('usernames').select()

        if (error) {
            console.log("Error while fetching deposits", error)
        }

        if (data == null) {
            console.log('No data fetched')
            return
        }

        try {
            return data.map(username => {
                return new SupabaseUsername(
                    username['id'],
                    username['username'],
                    username['user'],
                )
            })
        } catch (error) {
            console.log("Error while user name, probably caused by changes in the database", error)
        }
    }
}

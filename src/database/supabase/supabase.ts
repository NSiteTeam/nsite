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
import type date from '@/utils/interface/date'
import SupabaseFile from '../supabase/supabase_file'
import type { Username } from '../interface/username'
import type CustomFile from './../interface/file'
import type Message from '../interface/message'
import SupabaseMessage from './supabase_message'
import { SupabaseRole } from '@/database/interface/Role'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export class SupabaseClient implements DatabaseClient {
    // The value of this ref is the fetched files
    files: Ref<CustomFile[]> = ref([])

    // The value of this ref is the fetched repositories
    repositories: Ref<Repository[]> = ref([])

    // The value of this ref is fetched permissions
    fetchedMessages: Ref<Message[]> = ref([])

    // The value of this ref is the fetched messages
    messages: Ref<Repository[]> = ref([])

    // The value of this ref is true if the user is connected to the database
    isConnected: Ref<boolean> = ref(false)

    //  The email of the connected user or null if the user is not connected
    email: Ref<string | null> = ref(null)

    // The uuid of the connected user or null if the user is not connected
    uuid: Ref<string | null> = ref(null)

    first_date: Ref<string | null> = ref(null)/// <reference path="" />
    

    // The last connection date of the connected user or null if the user is not connected
    last_date: Ref<string | null>  = ref(null)

    // All the permissions of the user
    permissions: Ref<Array<Permission>> = ref(Array())

    /**
     * A list of news fetched from the database.
     * This list is updated when the method fetchNews(quantity) is called
     */
    fetchedNews: Ref<Array<News>> = ref(Array())
    private newsOffset: number = 0
    maxNewsReached: Ref<boolean> = ref(false)

    // A list of history points fetched from the database
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
        // Here the account exists, but the email is not verified yet
        const accountCreated = !error && user != null
        console.log("Error :", error)
        console.log("Account created:", accountCreated)
        return {
            "accountCreated": accountCreated,
            "error": error,
        }
    }

    /**
     * Sign in the user with the given email and password
     * @param email the email of the user
     * @param password the password of the user
     * @returns if the account was created or not. The return can be true even if the email is not yet verified
     */
    async logout(): Promise<any> {
        console.log("Trying to sign out")

        const { error } = await supabase.auth.signOut()
        return new Promise((resolve, reject) => {
            if (!error) {
                resolve("Vous êtes déconnecté")
            } else {
                reject(error)
            }
        })
    }

    /**
     * Login the user with the given email and password
     * @param email The email of the user
     * @param password The password of the user
     * @returns If the login was successful or not
     */
    async login(email: string, password: string): Promise<any> {
        console.log("Try to login with email: ", email)

        const { error } = await supabase.auth.signIn({
            email: email,
            password: password
        })

        await this.updateUserInfos()

        console.log("Connection status:", this.isConnected.value)

        return {
            "connectionStatus": this.isConnected.value,
            "error": error,
        }
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
        this.uuid.value = supabase.auth.user()?.id ?? null

        this.last_date.value = supabase.auth.user()?.last_sign_in_at ?? null

        this.first_date.value = supabase.auth.user()?.created_at ?? null

        await supabase.functions.invoke('fetch-permissions')
            .then(result => {
                try {
                    this.permissions.value = (result['data'] as unknown as Array<number>)
                    .map(e => Object.values(Permission)[e])
                } catch (error) {
                    console.log(`Error while updating permissions, 
                    probably caused by changes in the database`, error)
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
     * @param quantity the quantity of new to fetch
     */
    async fetchNews(quantity: number): Promise<void> {
        console.log(`Try to fetch ${quantity} news from ${this.newsOffset}`)

        return await supabase.functions.invoke('fetch-news',
        { body: JSON.stringify({ quantity: quantity, offset: this.newsOffset }) })
            .then(result => {
                const { news: array, maxNewsReached } = result['data']

                try {
                    array.forEach((news: any) => {
                        this.fetchedNews.value.push(new SupabaseNews(
                            news['title'],
                            news['subtitle'],
                            news['date'],
                            news['concerned'] ?
                            news['concerned'].map((level: number) => Object.values(Level)[level]) : null
                        ))
                    })
                } catch (error) {
                    console.log(`Error while updating permissions, 
                    probably caused by changes in the database`, error)
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

    async getRepos(id?: number): Promise<Repository[]> {
        console.log("Trying to fetch deposits in the database")

        // Here we can directly manipulate the database as deposits are public
        let { data, error } = !id ? await supabase.from('deposits').select() :
        await supabase.from('deposits').select().eq("id", id).maybeSingle()
        
        if (id) {
            data = [data]
        }

        return new Promise((resolve, reject) => {
            if (error == null && data) {
                this.repositories.value.push(data[0])
                resolve(data.map((repositories: Repository) => {
                    return new SupabaseRepository(
                        repositories['id'],
                        repositories['title'],
                        repositories['level'],
                        repositories['publication_date'],
                        repositories['description'],
                        repositories['content'],
                    )
                }))
            } else if (error) {
                reject(`Error while fetching deposits, 
                probably caused by changes in the database: ` + error.message)
            }
        })
        
    }

    async getUsername(uuid: string): Promise<any> {
        // Laurian: WE SHOULD NEVER EXPOSE ALL USER NAMES, REPLACE THIS BY A FUNCTION !!!!
        // Éric: No, with this we link uuids with usernames, without we cannot display usernames in the chat.
        const { data, error } = uuid ? await supabase.from('usernames')
        .select().eq("user", uuid).maybeSingle() : 
        await supabase.from('usernames').select()

        return new Promise((resolve, reject) => {
            if (!error && (data != null)) {
                resolve(
                    new SupabaseUsername(
                        data['username'],
                        data['user'],
                    )
                )
            } else if (error) {
                reject("Error while fetching data : " + error.message)
            } else if (data == null) {
                reject("No data fetched")
            }
        })
    }

    clearFiles() {
        this.files.value = []
    }

    async getRole(uuid: string): Promise<any>{
        // JB: Trying to create a function to get roles. I hope it'll work.
        // JB: It actually doesn't work: no data fetched.
        // I'll try to fix that.
        const { data, error } = uuid ? await supabase.from('profiles')
        .select().eq("user", uuid).maybeSingle():
        await supabase.from('profiles').select()

        return new Promise((resolve, reject) => {
            if (!error && (data != null)) {
                resolve(
                    new SupabaseRole(
                        data['uuid'],
                        data['role']
                    ) 
                )
            } else if (error) {
                reject("Error while fetching data : " + error.message)
            } else if (data == null) {
                reject("No data fetched")
            }
        })
    } 

    async getFile(id: number): Promise<CustomFile> {
        const { data, error } = await supabase.from('repository_file')
        .select().eq('id', id).maybeSingle()
        this.files.value.push(data)
        return new Promise((resolve, reject) => {
            resolve(new SupabaseFile(
                data.id,
                data.name,
                data.icon,
                data.date,
                data.last_commit_author,
                data.last_commit_date,
                data.file_url
            ))
        })
    }

    async fetchMessages(repoId: number): Promise<Message[]> {
        const { data, error } = await supabase.from(`deposits_chat_messages`)
        .select().eq('depoId', repoId)

        return new Promise((resolve, reject) => {
            if (error) {
                reject(error)
            } else if (data === null) {
                reject("No messages fetched")
            } else {
                resolve(
                    data.map((message: Message) => {
                        return new SupabaseMessage(
                            message.content,
                            message.author,
                            message.date,
                            message.id,
                        )
                    })
                )
            }
        })
    }

    async postMessage(author: string, content: string | null, depoId: number): Promise<Message[]> {
        const { data, error } = await supabase.from(`deposits_chat_messages`)
        .insert([{
            author: author,
            content: content,
            depoId: Math.floor(depoId)
        }]).eq("depoId", depoId)

        return new Promise((resolve, reject) => {
            if (error) {
                reject(error)
            } else if (data === null) {
                reject("No messages fetched")
            } else {
                resolve(
                    data.map((message: Message) => {
                        return new SupabaseMessage(
                            message.content,
                            message.author,
                            message.date,
                            message.id,
                        )
                    })
                )
            }
        })
    }

    async deleteMessage(messageId: number) {
        const { data, error } = await supabase.from('deposits_chat_messages')
        .delete()
        .match({ id: messageId })
        if (error) {
            console.warn(error)
        } else {
            console.log("Successfully deleted message " + messageId)
        }
        this.deleteMessageInTheCache(messageId)
    }

    async editMessage(messageId: number, newContent: string): Promise<void> {
        const { data, error } = await supabase.from('deposits_chat_messages')
        .update({
            content: newContent,
        })
        .match({
            id: messageId
        }).maybeSingle()
        if (error) {
            console.warn(error)
        } else {
            console.log(`Successfully edited message ${messageId} 
            from ${newContent} to ${data.content}`)
        }
        this.editMessageInTheCache(messageId, new SupabaseMessage(
            data.content,
            data.author,
            data.date,
            data.id
        ))
    }

    editMessageInTheCache(messageId: number, newMessage: Message) {
        // Checks every message to find the good one
        this.fetchedMessages.value.forEach(message => {
            if (message.id == messageId) {
                // Performs the change to the content
                let index = this.fetchedMessages.value.indexOf(message)
                this.fetchedMessages.value[index].content = newMessage.content
            }
        })
    }

    deleteMessageInTheCache(messageId: number) {
        // Checks every message to find the good one
        this.fetchedMessages.value.forEach(message => {
            if (message.id == messageId) {
                console.log(this.fetchedMessages.value)
                // Performs the deletion
                let index = this.fetchedMessages.value.indexOf(message)
                this.fetchedMessages.value.splice(index, index+1)
                console.log(this.fetchedMessages.value)
            }
        })
    }

    watchMessages(depoId: number) {
        supabase.from(`deposits_chat_messages:depoId=eq.${depoId}`)
        .on("INSERT", (payload: any) => {
            this.fetchedMessages.value.unshift(payload.new)
        })
        .on("UPDATE", (payload: any) => {
            this.editMessageInTheCache(payload.new.id, payload.new)
        })
        .on("DELETE", (payload: any) => {
            console.log(payload)
            this.deleteMessageInTheCache(payload.old.id)
        }).subscribe()
    }

    clearMessages() {
        this.fetchedMessages.value = []  
    }

    async postDeposit(title: string, level: string, description: string) : Promise<void> {
        const insertedData = {
            "title": title,
            "level": level,
            "description": description,
        }
        const { data, error } = await supabase.from('deposits').insert([insertedData])

        if (error) throw error.message
        else {
            console.log(`Added one deposit to the database : ${insertedData.title}`)
            return new Promise((resolve, reject) => resolve())
        }
    }

    async postHistotyPoint(title: string, content: string, date: string) : Promise<void> {
        const insertedData = {
            "title": title,
            "content": content,
            "date": date,
        }
        const { data, error } = await supabase.from('history_points').insert([insertedData])

        if (error) throw error.message
        console.log(`Added one history point : ${insertedData.title}`)
    }

    async postNews(title: string, content: string): Promise<void> {
        const insertedData = {
            "title": title,
            "subtitle": content,
        }
        const { data, error } = await supabase.from('news').insert([insertedData])

        if (error) throw error.message
        console.log(`Added one news to the database : ${insertedData.title}`)
    }

    async uploadFileToDeposit(file: File, deposit: string, message: string): Promise<string> {
        const author = this.uuid.value ? await this.getUsername( this.uuid.value) : "anonyme"
        const escapedFile = new File([file], file.name
            .normalize("NFD").replace(/[\u0300-\u036f]/g, ""), {type: file.type});
        console.log(escapedFile.name)
        const { data, error } = await supabase.storage.from('depositsfiles').upload(
            escapedFile.name, escapedFile, {
                cacheControl: '3600',
                upsert: false
            }
        )
        if (data != null) {
            const url = encodeURI(`https://xtaokvbipbsfiierhajp.supabase.co/storage/v1/object/public/${data.Key}`)
            const res = await supabase.from("repository_file").insert([{
                file_url: url,
                last_commit_text: message,
                last_commit_author: author,
                name: file.name
            }])
            res.error ? console.warn(res.error.message) : null
            res.data ? console.log(res.data) : null

            if (res.data && !res.error) {
                const responseForTheSelect = await supabase.from("deposits")
                // @ts-ignore res.data vaut any donc il est pas content qu'on lise des propriétés dessus
                .select().eq("title", deposit).maybeSingle()
                res.error ? console.warn(responseForTheSelect.error) : null
                // @ts-ignore res.data vaut any donc il est pas content qu'on lise des propriétés dessus
                res.data ? console.log(responseForTheSelect.data) : null

                const responseForTheUpdate = await supabase.from("deposits")
                // @ts-ignore res.data vaut any donc il est pas content qu'on lise des propriétés dessus
                .update([{ "content": responseForTheSelect.data.content.concat(res.data[0].id) }]).match({ "title": deposit })
                res.error ? console.warn(responseForTheUpdate.error) : null
                // @ts-ignore res.data vaut any donc il est pas content qu'on lise des propriétés dessus
                res.data ? console.log(responseForTheUpdate.data) : null
            }
        }

        return new Promise((resolve, reject) => {
            if (error) {
                reject(error)
            } else {
                resolve("Le fichier a bien été téléversé")
            }
        })
    }
}

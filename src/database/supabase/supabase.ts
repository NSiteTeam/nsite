import { createClient } from '@supabase/supabase-js'
import { ref, shallowRef, type Ref } from 'vue'
import type { DatabaseClient } from '../interface/database_client'
import type { Level } from '../interface/level'
import type { News } from '../interface/news'
import type { HistoryPoint } from '../interface/history_point'
import { SupabaseNews } from './supabase_news'
import { SupabaseRepository } from './supabase_repositories'
import { SupabaseUsername } from './supabase_username'
import { SupabaseHistory } from './supabase_history'
import type { Repository } from '../interface/repositories'
import type { Permission } from '@/database/interface/permissions'
import SupabaseFile from '../supabase/supabase_file'
import type CustomFile from './../interface/file'
import type Message from '../interface/message'
import SupabaseMessage from './supabase_message'
import { SupabaseUser } from './supabase_user'
import { SupabasePermissionHelper } from './supabase_permission_helper'
import { SupabaseLevelHelper } from './supabase_level_helper'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export class SupabaseClient implements DatabaseClient {
    constructor() {
        // At initialization we try to restore the previous session
        this.updateUserInfos()
    }

    // The value of this ref is the fetched files
    files: Ref<CustomFile[]> = ref([])

    // The number of fetched news (Laurian, j'ai mis 10 au pif, il fallait une valeur)
    numberOfNews: Ref<number> = ref(10)

    // The value of this ref is the fetched repositories
    repositories: Ref<Repository[]> = ref([])

    // The value of this ref is fetched permissions
    fetchedMessages: Ref<Message[]> = ref([])

    //  The email of the connected user or null if the user is not connected
    email: Ref<string | null> = ref(null)

    // The uuid of the connected user or null if the user is not connected
    uuid: Ref<string | null> = ref(null)

    // The username of the connected user or null if the user is not connected
    username: Ref<string | null> = ref(null)

    accountCreationDate: Ref<string | null> = ref(null)

    // The last connection date of the connected user or null if the user is not connected
    last_date: Ref<string | null>  = ref(null)

    // All the permissions of the user
    permissions: Ref<Array<Permission>> = ref(Array())

    // The value of this ref is the fetched messages
    messages: Ref<Repository[]> = ref([])

    // The value of this ref is true if the user is connected to the database
    isConnected: Ref<boolean> = ref(false)
    user: Ref<SupabaseUser | null> = shallowRef(null) // We make this ref shallow as an user is immutable

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
    async signIn(email: string, password: string, username: string): Promise<any> {
        console.log("Try to sign in with email: ", email)

        let { user, error } = await supabase.auth.signUp({
            email: email,
            password: password
        })
        console.log(user)

        const res = await supabase.from('usernames').insert({
            user: user?.id,
            username: username
        })
        error && res.error ? error = {status: 500, message: error.message + ' ' + res.error?.message} : null
        res.error ? error = {status: 500, message: res.error.message} : null

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

        const isConnected = supabase.auth.session() != null
        this.isConnected.value = isConnected

        if (isConnected) {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('username, roles')
                    .eq('user', supabase.auth.user()?.id)
                    .maybeSingle()

                if (error) {
                    throw error
                }

                if (!data) {
                    throw "Data returned by the request is null"
                }

                this.user.value = new SupabaseUser(
                    supabase.auth.user()?.email!,
                    data.username,
                    supabase.auth.user()?.id!,
                    data.roles.map(SupabasePermissionHelper.permissionFromId)
                )

            } catch (error) {
                console.log('Error while updating user infos', error)
            }

            console.log('Just updated user infos', this.user.value)
        } else {
            console.log('User isn\'t connected')
        }
    }

    /**
     * Add more new to the fetchedNews property
     * @param quantity the quantity of new to fetch
     */
    async fetchNews(quantity: number): Promise<void> {
        console.log(`Try to fetch ${quantity} news from ${this.newsOffset}`)

        try {
            const { data, error } = await supabase
                .from('news')
                .select("*")
                .order('date')
                .range(this.newsOffset, this.newsOffset + quantity - 1) // -1 As range is inclusive

            if (error) {
                throw "Error while fetching news" + error
            }

            if (!data) {
                throw "No data was returned"
            }


            data?.forEach((news: any) => {
                const concerned = news['concerned'] ? news['concerned'].map(SupabaseLevelHelper.getLevelById) : null

                this.fetchedNews.value.push(new SupabaseNews(
                    news['id'],
                    news['title'],
                    news['subtitle'],
                    news['date'],
                    concerned,
                    news['visible']
                ))
            })

            this.newsOffset += data.length
            this.maxNewsReached.value = data.length != quantity

        } catch (error) {
            console.log(`Error while updating permissions, probably caused by changes in the database`, error)
        }
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

    async getDeposits(id?: number): Promise<Repository[]> {
        console.log("Trying to fetch deposits in the database")

        try {
            const { data, error } = await supabase
                .from('deposits')
                .select('*')

            if (error) {
                throw error;
            }

            if (data == null) {
                throw "No data returned by request"
            }

            return data.map(deposit => new SupabaseRepository(
                deposit['id'],
                deposit['title'],
                SupabaseLevelHelper.getLevelById(deposit['level']),
                deposit['publication_date'],
                deposit['description'],
                deposit['content'],
                deposit['owners'],
            ))
        } catch (error) {
            console.log("Error while fetching owned deposits", error)
            return []
        }
    }

    async getOwnedDeposits(): Promise<Repository[]> {
        const uuid = supabase.auth.user()?.id

        console.log('Trying to fetch repositories owned by user', uuid)

        if (uuid == null) {
            return []
        }

        try {
            const { data, error } = await supabase
                .from('deposits')
                .select('*')
                .contains('owners', [uuid])

            if (error) {
                throw error;
            }

            if (data == null) {
                throw "No data returned by request"
            }

            return data.map(deposit => new SupabaseRepository(
                deposit['id'],
                deposit['title'],
                SupabaseLevelHelper.getLevelById(deposit['level']),
                deposit['publication_date'],
                deposit['description'],
                deposit['content'],
                deposit['owners']
            ))
        } catch (error) {
            console.log("Error while fetching owned deposits", error)
            return []
        }
    }

    async getDeposit(id: number): Promise<Repository | null> {
        const uuid = supabase.auth.user()?.id

        try {
            const { data, error } = await supabase
                .from('deposits')
                .select('*')
                .contains('owners', [uuid])
                .eq("id", id)
                .maybeSingle()

            if (error) {
                throw error;
            }

            if (data == null) {
                throw "No data returned by request"
            }

            return new SupabaseRepository(
                data['id'],
                data['title'],
                SupabaseLevelHelper.getLevelById(data['level']),
                data['publication_date'],
                data['description'],
                data['content'],
                data['owners']
            )
        } catch (error) {
            console.log("Error while fetching owned deposit", id, error)
            return null
        }
    }

    async deleteDeposit(id: number): Promise<string | void> {
        // Gets the files remaining in the depo
        const { data, error } = await supabase.from('deposits')
        .select().eq('id', id).maybeSingle()
        error ? console.warn(error.message) : null

        if (data != null) {
            if (data.content != null){
                // Deletes these selected files
                const deleteFilesResponse = await supabase.from('repository_files')
                .delete().in('id', data.content)
                deleteFilesResponse.error ? console.warn(deleteFilesResponse.error.message) : null

                if (deleteFilesResponse.data != null && !deleteFilesResponse.error) {
                    // Deletes the depo
                    const deleteDepoResponse = await supabase.from('deposits')
                    .delete().match({ 'id': id })

                    return new Promise((resolve, reject) => {
                        deleteDepoResponse.error ? reject(deleteDepoResponse.error) : resolve("Dépôt supprimé avec succès")
                    })
                }
            } else {
                const deleteDepoResponse = await supabase.from('deposits')
                .delete().match({ 'id': id })
                
                return new Promise((resolve, reject) => {
                    deleteDepoResponse.error ? reject(deleteDepoResponse.error) : resolve("Dépôt supprimé avec succès")
                })
            }
        } else {
            console.warn("No data fetched")
        }


    }

    async getUsername(uuid: string): Promise<string> {
        const { data, error } = await supabase.from('profiles')
        .select().eq("user", uuid).maybeSingle()

        return new Promise((resolve, reject) => {
            if (!error && (data != null)) {
                resolve(
                    data['username']
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
                data.last_commit_text,
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

    async postDeposit(title: string, level: Level, description: string) : Promise<void> {
        const levelId = SupabaseLevelHelper.getIdByLevel(level)

        const insertedData = {
            "title": title,
            "level": levelId,
            "description": description,
            "owners": [this.user.value?.uuid]
        }

        const { error } = await supabase.from('deposits').insert([insertedData])

        if (error) {
            throw error
        }

        console.log(`Added one deposit to the database : ${insertedData.title}`)
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

    /* What it does :
        1: uploads the file to a storage bucket
        2: registers the file object in the dB
        3: selects the already present files in the depo
        4: updates the content in the depo */
    async uploadFileToDeposit(file: File, deposit: string, message: string, fileName?: string): Promise<string> {
        // Removes the bad caracters from the file name
        const newName = (fileName || file.name)
        .replace(/[<>{}%`\[\]~#^:'’"/\\|?*]/g, ' ')
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        // Removes the bad caracters from the deposit name
        const cleanDepositName = deposit
        .replace(/[<>{}%`\[\]~#^:'’"/\\|?*]/g, ' ')
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")

        // Uploads data to the storage bucket
        const escapedFile = new File([file], newName, {type: file.type});

        console.log(deposit + '/' + newName)
        const { data, error } = await supabase.storage.from('depositsfiles').upload(
            cleanDepositName + '/' + newName, escapedFile, {
                cacheControl: '3600',
                upsert: false
            }
        )
        if (data != null && this.user.value) {
            // Registers the file in the database
            const url = encodeURI(`https://xtaokvbipbsfiierhajp.supabase.co/storage/v1/object/public/${data.Key}`)
            const res = await supabase.from("repository_file").insert([{
                file_url: url,
                last_commit_text: message,
                last_commit_author: this.user.value.username,
                name: newName
            }])
            res.error ? console.warn(res.error.message) : null
            res.data ? console.log(res.data) : null

            if (res.data && !res.error) {
                // Gets the files that are already in the depo
                const responseForTheSelect = await supabase.from("deposits")
                // @ts-ignore res.data vaut any donc il est pas content qu'on lise des propriétés dessus
                .select().eq("title", deposit).maybeSingle()
                res.error ? console.warn(responseForTheSelect.error) : null
                // @ts-ignore res.data vaut any donc il est pas content qu'on lise des propriétés dessus
                res.data ? console.log(responseForTheSelect.data) : null

                const oldData = responseForTheSelect.data.content || []
                // Adds the file to the depo
                const responseForTheUpdate = await supabase.from("deposits")
                // @ts-ignore res.data is any so he is not happy
                .update([{ "content": oldData.concat(res.data[0].id) }])
                .match({ "title": deposit })

                res.error ? console.warn(responseForTheUpdate.error) : null
                res.data ? console.log(responseForTheUpdate.data) : null
            }
        }
        // OMG that was a long journey to upload a file 😅
        return new Promise((resolve, reject) => {
            if (error) {
                reject(error.message)
            } else {
                resolve("Le fichier a bien été téléversé")
            }
        })
    }

    async editNews(id: number, title: string, content: string): Promise<string> {
        const { data, error } = await supabase.from('news')
        .update({ title: title, subtitle: content }).match({ id: id })

        return new Promise((resolve, reject) => {
            (!error && data) ? resolve("L'évènment a bien été mis à jour") : reject(error.message)
        })
    }

    async editDepo(id: number, title: string, description: string, level: number): Promise<string> {
        const { data, error } = await supabase.from('deposits')
        .update({ title: title, description: description, level: level }).match({ id: id })

        return new Promise((resolve, reject) => {
            (!error && data) ? resolve("Le dépôt a bien été mis à jour") : reject(error.message)
        })
    }

    async renameFile(id: number, newName: string, newMessage: string): Promise<any> {
        const { data, error } = await supabase.from('repository_file')
        .update({ name: newName, last_commit_text: newMessage })
        .match({ id: id })

        return new Promise((resolve, reject) => {
            (data != null) && (!error) ? resolve(data) : reject(error.message)
        })
    }
}

import { createClient } from '@supabase/supabase-js'
import type { ApiError, PostgrestError } from '@supabase/supabase-js'
import { ref, shallowRef, type Ref } from 'vue'
import type { DatabaseClient, errorMessage } from '../interface/database_client'
import { Level } from '../interface/level'
import type { News } from '../interface/news'
import type { HistoryPoint } from '../interface/history_point'
import { SupabaseNews } from './supabase_news'
import { SupabaseRepository } from './supabase_repositories'
import { SupabaseUsername } from './supabase_username'
import { SupabaseHistoryPoint } from './supabase_history'
import type { Repository } from '../interface/repositories'
import type { Permission } from '@/database/interface/permissions'
import SupabaseFile from '../supabase/supabase_file'
import type CustomFile from './../interface/file'
import type Message from '../interface/message'
import SupabaseMessage from './supabase_message'
import { SupabaseUser } from './supabase_user'
import { supabase } from './supabase_client'
import { SupabasePermissionHelper } from './supabase_permission_helper'
import { SupabaseLevelHelper } from './supabase_level_helper'
import { LongDate } from '@/utils/long_date'
import { databaseClient } from '../implementation'
import { SchoolProgram, ThemeResourceType } from '../interface/school_program'
import type { Theme, ThemeResource } from '../interface/school_program'
import type { PreviewData } from '../interface/preview_data'


const TRY_AGAIN_LATER = 'Une erreur est survenue, réessayez plus tard'

export class SupabaseClient implements DatabaseClient {

  constructor() {
    // At initialization we try to restore the previous session
    this.updateConnectionStatus()
  }

  /* User */
  isConnected: Ref<boolean> = ref(false)
  user: Ref<SupabaseUser | null> = shallowRef(null) // We make this ref shallow as an user is immutable

  async register(email: string, password: string): Promise<void> {
    console.log(`Send registration request with email ${email}`)

    let { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    }, {
      redirectTo: window.location.host
    })

    this.assertNoError(error, 'Registration request failed')

    console.log('Registration request back without error, waiting for email confirmation')

    /**
     * TODO-API: Here we cannot now if their was already an user with the same email.
     * (https://github.com/supabase/supabase-js/issues/296). So we should transfer
     * account creation in the API where the function createUser() is available and
     * return if an user with the same email already exists.
     */
  }

  async login(email: string, password: string): Promise<void> {
    console.log(`Send login request with email ${email}`)

    const { error } = await supabase.auth.signIn({
      email: email,
      password: password
    })

    this.assertNoError(error, 'Login request failed')
    console.log('Login request back without error')

    this.updateConnectionStatus()

    this.assertWorked(this.isConnected.value, TRY_AGAIN_LATER, 'Login')
    console.log('The user is now connected')
  }

  async logout(): Promise<void> {
    console.log("Trying to sign out")

    const { error } = await supabase.auth.signOut()

    this.assertNoError(error, 'Sign out request failed')
    console.log('Sign out request back without error')

    this.updateConnectionStatus()

    this.assertWorked(!this.isConnected.value, TRY_AGAIN_LATER, 'Sign out')
  }

  /* Program */
  fetchedProgram: SchoolProgram | null = null
  async getProgram(): Promise<SchoolProgram> {
    console.log('Fetching school program') // TODO: Should we store it in the local storage ?

    if (this.fetchedProgram != null) {
      console.log('School program already fetched, returning cached value')
      return this.fetchedProgram
    }

    const { data, error } = await supabase
      .from('themes')
      .select()

    this.assertNoError(error, 'Fetching school program failed')
    this.assertWorked(data != null, TRY_AGAIN_LATER, 'Fetching school program')

    let program = new SchoolProgram()
    data!!.forEach((theme) => program.add(Level.levelFromIndex(theme.level) !!, {
      uuid: theme.uuid,
      name: theme.name,
      description: theme.description,
      numberOfExercises: theme.resources_interrogations,
      numberOfInterrogations: theme.resources_exercises,
      numberOfCorrections: theme.resources_with_correction
    }))

    console.log(`Built school program from the data, storing it into the cache`, program)
    this.fetchedProgram = program

    return program
  }

  async getThemeByUuid(uuid: string): Promise<Theme | null> {
    if (this.fetchedProgram == null) {
      await this.getProgram()
    }

    return this.fetchedProgram!!.find((theme) => theme.uuid == uuid)
  }

  fetchedResources = new Map<string, ThemeResource[]>()
  async getThemeResources(uuid: string): Promise<ThemeResource[] | null> {
    console.log(`Fetching resources of theme of uuid $uuid`)

    if (this.fetchedResources.get(uuid)) {
      console.log(`Resources of theme of uuid ${uuid} already fetched, returning cached value`)

      return this.fetchedResources.get(uuid)!!
    }

    const { data, error } = await supabase
      .from('themes_resources')
      .select()
      .eq('theme_uuid', uuid)

    this.assertNoError(error, 'Fetching resources of theme failed')
    this.assertWorked(data != null, TRY_AGAIN_LATER, 'Fetching resources of theme')

    console.log(`Fetched resources of theme of uuid ${uuid}`, data)

    return data!!.map((resource: any) => ({
      name: resource.name,
      message: resource.message,
      internalResource: resource.internal_resource,
      contentURL: resource.content_url,
      type: resource.type as ThemeResourceType,
    }))
  }

  async getPreviewDataOfURL(url: string): Promise<PreviewData> {
    console.log(`Computing server-side preview data of url ${url}`)

    const { data, error } = await supabase.functions.invoke('preview-url', {
      body: JSON.stringify({ url: url })
    })

    this.assertNoError(error, 'Fetching preview data failed')

    console.log(`Computed server-side preview data of url ${url}`, data)

    return {
      title: data!!.title,
      description: data!!.description,
      image: data!!.image,
    }
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
  last_date: Ref<string | null> = ref(null)

  // All the permissions of the user
  permissions: Ref<Array<Permission>> = ref(Array())

  // The value of this ref is the fetched messages
  messages: Ref<Repository[]> = ref([])


  /**
   * A list of news fetched from the database.
   * This list is updated when the method fetchNews(quantity) is called
   */
  fetchedNews: Ref<Array<News>> = ref(Array())
  private newsOffset: number = 0
  maxNewsReached: Ref<boolean> = ref(false)

  // A list of history points fetched from the database
  fetchedHistoryPoints: Ref<HistoryPoint[]> = ref([])




  /**
   * Private method to update the data of the user. For the moment it updates :
   *  - Connection status
   *  - User email
   */
  private updateConnectionStatus() {
    console.log('Updating connection status')

    const isConnected = supabase.auth.session() != null
    this.isConnected.value = isConnected

    if (!isConnected) {
      console.log("User isn't connected")
      return
    } else {
      console.log('User is connected')
    }

    this.user.value = new SupabaseUser(
      supabase.auth.user()?.email!,
      supabase.auth.user()?.id!
    )

    console.log('Just updated connection status', this.user.value)
  }

  /**
   * Add more new to the fetchedNews property
   * @param quantity the quantity of new to fetch
   */
  async fetchNews(
    quantity: number,
    onlyVisible: boolean = true,
  ): Promise<void> {
    console.log(`Try to fetch ${quantity} news from ${this.newsOffset}`)

    try {
      let request = supabase
        .from('news')
        .select('*')
        .order('date')
        .range(this.newsOffset, this.newsOffset + quantity - 1) // -1 As range is inclusive

      if (onlyVisible) {
        request = request.eq('visible', true)
      }

      const { data, error } = await request

      if (error) {
        throw 'Error while fetching news' + error
      }

      if (!data) {
        throw 'No data was returned'
      }

      data?.forEach((news: any) => {
        const concerned = news['concerned']
          ? news['concerned'].map(SupabaseLevelHelper.getLevelById)
          : null

        this.fetchedNews.value.push(
          new SupabaseNews(
            news['id'],
            news['title'],
            news['content'],
            LongDate.ISOStringToLongDate(news['date']),
            concerned,
            news['visible'],
          ),
        )
      })

      this.newsOffset += data.length
      this.maxNewsReached.value = data.length != quantity
    } catch (error) {
      console.log(
        `Error while updating permissions, probably caused by changes in the database`,
        error,
      )
    }
  }

  historyPointsFetched = false
  async fetchHistoryPoints(): Promise<any> {
    console.log(`Try to fetch history points`)

    if (this.historyPointsFetched) {
      console.log('History points already fetched')
      return true
    }

    this.historyPointsFetched = true

    try {
      const { data, error } = await supabase
        .from('history_points')
        .select('*')
        .order('date')

      if (error) {
        throw 'Error while fetching history points' + error
      }

      if (!data) {
        throw 'No data was returned'
      }

      data?.forEach((historyPoint: any) => {
        this.fetchedHistoryPoints.value.push(
          new SupabaseHistoryPoint(
            historyPoint['id'],
            historyPoint['title'],
            historyPoint['content'],
            LongDate.fromForm(historyPoint['date']),
            historyPoint['visible'],
          ),
        )
      })

      this.fetchedHistoryPoints.value.sort(
        (a, b) => -1 * LongDate.compare(a.date, b.date),
      )
    } catch (error) {
      console.log(`Error while fetching history points`, error)
    }
  }

  async getDeposits(id?: number): Promise<Repository[]> {
    console.log('Trying to fetch deposits in the database')

    try {
      const { data, error } = await supabase.from('deposits').select('*')

      if (error) {
        throw error
      }

      if (data == null) {
        throw 'No data returned by request'
      }

      return data.map(
        (deposit) =>
          new SupabaseRepository(
            deposit['id'],
            deposit['title'],
            SupabaseLevelHelper.getLevelById(deposit['level']),
            deposit['publication_date'],
            deposit['description'],
            deposit['content'],
            deposit['owners'],
          ),
      )
    } catch (error) {
      console.log('Error while fetching owned deposits', error)
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
        throw error
      }

      if (data == null) {
        throw 'No data returned by request'
      }

      return data.map(
        (deposit) =>
          new SupabaseRepository(
            deposit['id'],
            deposit['title'],
            SupabaseLevelHelper.getLevelById(deposit['level']),
            deposit['publication_date'],
            deposit['description'],
            deposit['content'],
            deposit['owners'],
          ),
      )
    } catch (error) {
      console.log('Error while fetching owned deposits', error)
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
        .eq('id', id)
        .maybeSingle()

      if (error) {
        throw error
      }

      if (data == null) {
        throw 'No data returned by request'
      }

      return new SupabaseRepository(
        data['id'],
        data['title'],
        SupabaseLevelHelper.getLevelById(data['level']),
        data['publication_date'],
        data['description'],
        data['content'],
        data['owners'],
      )
    } catch (error) {
      console.log('Error while fetching owned deposit', id, error)
      return null
    }
  }

  async deleteDeposit(id: number): Promise<string | void> {
    // Gets the files remaining in the depo
    const { data, error } = await supabase
      .from('deposits')
      .select()
      .eq('id', id)
      .maybeSingle()
    error ? console.warn(error.message) : null

    // If there is nothing, return nothing
    if (data == null) {
      console.warn('No data fetched')
      return
    }

    // If there is nothing in the depo, delete it
    if (data.content == null) {
      const deleteDepoResponse = await supabase
        .from('deposits')
        .delete()
        .match({ id: id })

      return new Promise((resolve, reject) => {
        deleteDepoResponse.error
          ? reject(deleteDepoResponse.error)
          : resolve('Dépôt supprimé avec succès')
      })
    }

    // Deletes these selected files
    const deleteFilesResponse = await supabase
      .from('repository_file')
      .delete()
      .in('id', data.content)

    if (deleteFilesResponse.error) {
      console.warn(deleteFilesResponse.error.message)
      return
    }

    if (deleteFilesResponse.data != null) {
      // Deletes the depo
      const deleteDepoResponse = await supabase
        .from('deposits')
        .delete()
        .match({ id: id })

      return new Promise((resolve, reject) => {
        deleteDepoResponse.error
          ? reject(deleteDepoResponse.error)
          : resolve('Dépôt supprimé avec succès')
      })
    }
  }

  async getUsername(uuid: string): Promise<string> {
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('user', uuid)
      .maybeSingle()

    return new Promise((resolve, reject) => {
      if (error) {
        reject('Error while fetching data : ' + error.message)
      }
      if (data == null) {
        reject('No data fetched')
      }
      resolve(data['username'])
    })
  }

  async getFile(id: number): Promise<CustomFile> {
    const { data, error } = await supabase
      .from('repository_file')
      .select()
      .eq('id', id)
      .maybeSingle()

    return new Promise((resolve, reject) => {
      if (data != null)
        resolve(
          new SupabaseFile(
            data.id,
            data.name,
            data.icon,
            data.date,
            data.last_commit_author,
            data.last_commit_text,
            data.file_url,
          ),
        )
    })
  }

  async deleteFile(id: number): Promise<any> {
    const { error } = await supabase
      .from('repository_file')
      .delete()
      .match({ id: id })

    // Updates the fkeys in the deposits
    const responseForTheSelect = await supabase
      .from('deposits')
      .select()
      .contains('content', [id])

    if (responseForTheSelect.data) {
      const newContents = responseForTheSelect.data.map((depo) => {
        return depo.content.filter((fileId: number) => {
          return id != fileId
        })
      })
      const ids = responseForTheSelect.data.map((depo) => {
        return depo.id
      })
      for (let i = 0; i < responseForTheSelect.data.length; i++) {
        const { data, error } = await supabase
          .from('deposits')
          .update({ content: newContents[i] })
          .match({ id: ids[i] })
      }
    }

    return new Promise((resolve, reject) => {
      if (error) {
        reject(error)
      }
      resolve('Fichier supprimé avec succès')
    })
  }

  async fetchMessages(repoId: number): Promise<Message[]> {
    const { data, error } = await supabase
      .from(`deposits_chat_messages`)
      .select()
      .eq('depoId', repoId)

    return new Promise((resolve, reject) => {
      if (error) {
        reject(error)
      }
      if (data === null) {
        reject('No messages fetched')
        return
      }

      resolve(
        data.map((message: Message) => {
          return new SupabaseMessage(
            message.content,
            message.author,
            message.date,
            message.id,
          )
        }),
      )
    })
  }

  async postMessage(
    content: string | null,
    depoId: number,
  ): Promise<Message[]> {
    const { data, error } = await supabase
      .from(`deposits_chat_messages`)
      .insert([
        {
          author: this.user.value?.uuid ? this.user.value.uuid : 'anonyme',
          content: content,
          depoId: Math.floor(depoId),
        },
      ])
      .eq('depoId', depoId)

    return new Promise((resolve, reject) => {
      if (error) {
        reject(error)
      }
      if (data === null) {
        reject('No messages fetched')
        return
      }
      resolve(
        data.map((message: Message) => {
          return new SupabaseMessage(
            message.content,
            message.author,
            message.date,
            message.id,
          )
        }),
      )
    })
  }

  async deleteMessage(messageId: number) {
    const { data, error } = await supabase
      .from('deposits_chat_messages')
      .delete()
      .match({ id: messageId })
    
    if (error) {
      console.warn(error)
      return
    }
    console.log('Successfully deleted message ' + messageId)

    this.deleteMessageInTheCache(messageId)
  }

  async editMessage(messageId: number, newContent: string): Promise<void> {
    const { data, error } = await supabase
      .from('deposits_chat_messages')
      .update({
        content: newContent,
      })
      .match({
        id: messageId,
      })
      .maybeSingle()
    
    if (error) {
      console.warn(error)
      return
    }

    console.log(`Successfully edited message ${messageId}
          from ${newContent} to ${data.content}`)
      
    this.editMessageInTheCache(
      messageId,
      new SupabaseMessage(data.content, data.author, data.date, data.id),
    )
  }

  editMessageInTheCache(messageId: number, newMessage: Message) {
    // Checks every message to find the good one
    this.fetchedMessages.value.forEach((message) => {
      if (message.id == messageId) {
        // Performs the change to the content
        let index = this.fetchedMessages.value.indexOf(message)
        this.fetchedMessages.value[index].content = newMessage.content
      }
    })
  }

  deleteMessageInTheCache(messageId: number) {
    // Checks every message to find the good one
    this.fetchedMessages.value.forEach((message) => {
      if (message.id == messageId) {
        console.log(this.fetchedMessages.value)
        // Performs the deletion
        let index = this.fetchedMessages.value.indexOf(message)
        this.fetchedMessages.value.splice(index, index + 1)
        console.log(this.fetchedMessages.value)
      }
    })
  }

  watchMessages(depoId: number) {
    supabase
      .from(`deposits_chat_messages:depoId=eq.${depoId}`)
      .on('INSERT', (payload: any) => {
        this.fetchedMessages.value.unshift(payload.new)
      })
      .on('UPDATE', (payload: any) => {
        this.editMessageInTheCache(payload.new.id, payload.new)
      })
      .on('DELETE', (payload: any) => {
        console.log(payload)
        this.deleteMessageInTheCache(payload.old.id)
      })
      .subscribe()
  }

  clearMessages() {
    this.fetchedMessages.value = []
  }

  async postDeposit(
    title: string,
    level: Level,
    description: string,
  ): Promise<void> {
    const levelId = SupabaseLevelHelper.getIdByLevel(level)

    const insertedData = {
      title: title,
      level: levelId,
      description: description,
      owners: [this.user.value?.uuid],
    }

    const { error } = await supabase.from('deposits').insert([insertedData])

    if (error) {
      throw error
    }

    console.log(`Added one deposit to the database : ${insertedData.title}`)
  }

  async postHistotyPoint(
    title: string,
    content: string,
    date: string,
  ): Promise<void> {
    const insertedData = {
      title: title,
      content: content,
      date: date,
    }
    const { data, error } = await supabase
      .from('history_points')
      .insert([insertedData])

    if (error) throw error.message
    console.log(`Added one history point : ${insertedData.title}`)
  }

  async createEmptyNews(title: string): Promise<News> {
    console.log('Trying to create an empty news in the database')
    const { data, error } = await supabase.from('news').insert([
      {
        title: title,
      },
    ])

    if (error) {
      throw error.message
    }

    const addedNews = new SupabaseNews(
      data[0]['id'],
      data[0]['title'],
      data[0]['content'],
      LongDate.ISOStringToLongDate(data[0]['date']),
      data[0]['concerned'],
      data[0]['visible'],
    )

    console.log('Added one news in the database', addedNews)

    this.fetchedNews.value.push(addedNews)
    this.newsOffset += 1

    return addedNews
  }

  async createEmptyHistoryPoint(title: string): Promise<HistoryPoint> {
    console.log('Trying to create an empty history point in the database')

    const { data, error } = await supabase.from('history_points').insert([
      {
        title: title,
      },
    ])

    if (error) {
      console.log('Error while creating history point', error)
      throw error.message
    }

    const addedHistoryPoint = new SupabaseHistoryPoint(
      data[0]['id'],
      data[0]['title'],
      data[0]['content'],
      LongDate.fromForm(data[0]['date']),
      data[0]['visible'],
    )

    console.log('Added one news in the database', addedHistoryPoint)

    this.fetchedHistoryPoints.value.push(addedHistoryPoint)
    this.fetchedHistoryPoints.value.sort(
      (a, b) => -1 * LongDate.compare(a.date, b.date),
    )

    return addedHistoryPoint
  }

  async switchVisibilityOfNews(news: News): Promise<errorMessage | null> {
    console.log('Trying to switch visibility of', news)

    const { data, error } = await supabase
      .from('news')
      .update({
        visible: !news.visible,
      })
      .match({ id: news.id })

    if (error) {
      console.log('Error while switching visibility of a news', error)
      return error.toString()
    }

    const index = this.fetchedNews.value.indexOf(news)
    this.fetchedNews.value[index].visible = !news.visible

    console.log('News visibility updated with success', data)

    return null
  }

  async switchVisibilityOfHistoryPoint(
    historyPoint: HistoryPoint,
  ): Promise<errorMessage | null> {
    console.log('Trying to switch visibility of', historyPoint)

    const { data, error } = await supabase
      .from('history_points')
      .update({
        visible: !historyPoint.visible,
      })
      .match({ id: historyPoint.id })

    if (error) {
      console.log('Error while switching visibility of an history point', error)
      return error.toString()
    }

    const index = this.fetchedHistoryPoints.value.indexOf(historyPoint)
    this.fetchedHistoryPoints.value[index].visible = !historyPoint.visible

    console.log('History point visibility updated with success', data)

    return null
  }

  async deleteNews(news: News): Promise<errorMessage | null> {
    console.log('Trying to delete', news)

    const { data, error } = await supabase
      .from('news')
      .delete()
      .match({ id: news.id })

    if (error) {
      console.log('Error while deleting news', error)
      return error.toString()
    }

    const index = this.fetchedNews.value.indexOf(news)
    this.fetchedNews.value.splice(index, 1)
    this.newsOffset -= 1

    console.log('News deleted with success', data)

    return null
  }

  async deleteHistoryPoint(
    historyPoint: HistoryPoint,
  ): Promise<errorMessage | null> {
    console.log('Trying to delete', historyPoint)

    const { data, error } = await supabase
      .from('history_points')
      .delete()
      .match({ id: historyPoint.id })

    if (error) {
      console.log('Error while deleting news', error)
      return error.toString()
    }

    const index = this.fetchedHistoryPoints.value.indexOf(historyPoint)
    this.fetchedHistoryPoints.value.splice(index, 1)

    console.log('History point deleted with success', data)

    return null
  }

  /* What it does :
        1: uploads the file to a storage bucket
        2: registers the file object in the dB
        3: selects the already present files in the depo
        4: updates the content in the depo */
  async uploadFileToDeposit(
    file: File,
    deposit: string,
    message: string,
    fileName?: string,
  ): Promise<string> {
    // Removes the bad caracters from the file name
    const newName = (fileName || file.name)
      .replace(/[<>{}%`\[\]~#^:'’"/\\|?*]/g, ' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    // Removes the bad caracters from the deposit name
    const cleanDepositName = deposit
      .replace(/[<>{}%`\[\]~#^:'’"/\\|?*]/g, ' ')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    // Uploads data to the storage bucket
    const escapedFile = new File([file], newName, { type: file.type })

    console.log(deposit + '/' + newName)
    const { data, error } = await supabase.storage
      .from('depositsfiles')
      .upload(cleanDepositName + '/' + newName, escapedFile, {
        cacheControl: '3600',
        upsert: false,
      })
    if (data != null && this.user.value) {
      // Registers the file in the database
      const url = encodeURI(
        `https://xtaokvbipbsfiierhajp.supabase.co/storage/v1/object/public/${data.Key}`,
      )
      const res = await supabase.from('repository_file').insert([
        {
          file_url: url,
          last_commit_text: message,
          last_commit_author: this.user.value.username,
          name: newName,
        },
      ])
      res.error ? console.warn(res.error.message) : null
      res.data ? console.log(res.data) : null

      if (res.data && !res.error) {
        // Gets the files that are already in the depo
        const responseForTheSelect = await supabase
          .from('deposits')
          // @ts-ignore res.data vaut any donc il est pas content qu'on lise des propriétés dessus
          .select()
          .eq('title', deposit)
          .maybeSingle()
        res.error ? console.warn(responseForTheSelect.error) : null
        // @ts-ignore res.data vaut any donc il est pas content qu'on lise des propriétés dessus
        res.data ? console.log(responseForTheSelect.data) : null

        const oldData = responseForTheSelect.data.content || []
        // Adds the file to the depo
        const responseForTheUpdate = await supabase
          .from('deposits')
          // @ts-ignore res.data is any so he is not happy
          .update([{ content: oldData.concat(res.data[0].id) }])
          .match({ title: deposit })

        res.error ? console.warn(responseForTheUpdate.error) : null
        res.data ? console.log(responseForTheUpdate.data) : null
      }
    }
    // OMG that was a long journey to upload a file 😅
    return new Promise((resolve, reject) => {
      if (error) reject(error.message)
      resolve('Le fichier a bien été téléversé')
    })
  }

  async updateNews(news: News): Promise<errorMessage | null> {
    console.log('Trying to update news', news)

    const { data, error } = await supabase
      .from('news')
      .update({
        date: news.date.toForm(),
        title: news.title,
        visible: news.visible,
        concerned: news.concerned.map(SupabaseLevelHelper.getIdByLevel),
        content: news.content,
      })
      .match({ id: news.id })

    if (error) {
      console.log('Error while updating news', error)
      return error.toString()
    }

    console.log('News updated with success', data)

    return null
  }

  async updateHistoryPoint(
    historyPoint: HistoryPoint,
  ): Promise<errorMessage | null> {
    console.log('Trying to update history point', historyPoint)

    const { data, error } = await supabase
      .from('history_points')
      .update({
        date: historyPoint.date.toForm(),
        title: historyPoint.title,
        visible: historyPoint.visible,
        content: historyPoint.content,
      })
      .match({ id: historyPoint.id })

    if (error) {
      console.log('Error while updating history point', error)
      return error.toString()
    }

    console.log('History point updated with success', data)

    return null
  }

  async editDeposit(
    id: number,
    title: string,
    description: string,
    level: number,
  ): Promise<string> {
    const { data, error } = await supabase
      .from('deposits')
      .update({ title: title, description: description, level: level })
      .match({ id: id })

    return new Promise((resolve, reject) => {
      !error && data
        ? resolve('Le dépôt a bien été mis à jour')
        : reject(error.message)
    })
  }

  async renameFile(
    id: number,
    newName: string,
    newMessage: string,
  ): Promise<any> {
    const { data, error } = await supabase
      .from('repository_file')
      .update({ name: newName, last_commit_text: newMessage })
      .match({ id: id })

    return new Promise((resolve, reject) => {
      data != null && !error ? resolve(data) : reject(error.message)
    })
  }

  async getAllUsers(quantity?: number): Promise<any> {
    const { data, error } = quantity
      ? await supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .range(0, quantity - 1)
      : await supabase.from('profiles').select('*')

    return new Promise((resolve, reject) => {
      if (error) {
        reject(error)
      }
      if (data == null) {
        reject('No data fetched')
        return
      }
      resolve(data)
    })
  }

  private assertNoError(error: Error | ApiError | PostgrestError | null, message: string): void {
    if (error) {
      console.error(message, error)
      throw error.message
    }
  }

  private assertWorked(condition: boolean, message: string, task: string): void {
    if (!condition) {
      console.error(`Task "${task}" failed: ${message}`)
      throw message
    }
  }
}

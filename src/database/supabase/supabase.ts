import type { ApiError, PostgrestError } from '@supabase/supabase-js'
import { ref, shallowRef, type Ref } from 'vue'
import type { DatabaseClient, errorMessage } from '../interface/database_client'
import { Level } from '../interface/level'
import type { News } from '../interface/news'
import type { HistoryPoint } from '../interface/history_point'
import type { UserMessage } from '../interface/user_message'
import { SupabaseNews } from './supabase_news'
import { SupabaseUserMessage } from './supabase_messages_user'
import { SupabaseRepository } from './supabase_repositories'
import { SupabaseHistoryPoint } from './supabase_history'
import type { Repository } from '../interface/repositories'
import { Permission } from '@/database/interface/permissions'
import SupabaseFile from '../supabase/supabase_file'
import type CustomFile from './../interface/file'
import type Message from '../interface/message'
import SupabaseMessage from './supabase_message'
import { SupabaseUser } from './supabase_user'
import { supabase } from './supabase_client'
import { SupabasePermissionHelper } from './supabase_permission_helper'
import { SupabaseLevelHelper } from './supabase_level_helper'
import { LongDate } from '@/utils/long_date'
import {
  getElementsInArrayByKeyValue,
  removeBadChars,
} from '@/utils/misc_utils'
import { SchoolProgram } from '../interface/school_program'
import type {
  Theme,
  ThemeResource,
  ThemeResourceType,
  ThemeResourceFile,
  InternalThemeResourceFile,
} from '../interface/school_program'
import type { PreviewData } from '../interface/preview_data'
import { Cacheable } from './cacheable'
import { timestampToFrenchDate } from '@/utils/date'

const TRY_AGAIN_LATER = 'Une erreur est survenue, réessayez plus tard'

export class SupabaseClient implements DatabaseClient {
  constructor() {
    // At initialization we try to restore the previous session
    this.updateConnectionStatus()
  }

  /* User */
  isConnected: Ref<boolean> = ref(false)
  user: Ref<SupabaseUser | null> = shallowRef(null) // We make this ref shallow as an user is immutable

  userPermissionsCache: Cacheable<(Permission | null)[]> = new Cacheable(
    'permissions',
    async () => {
      if (!this.isConnected.value) {
        return []
      }

      if (typeof this.user.value?.uuid == 'undefined') return []
      
      const { data, error } = await supabase
        .from('roles')
        .select()
        .contains('users', [this.user.value?.uuid])

      this.assertNoError(error, 'Fetching permissions failed')

      return (
        data?.map((role) => {
          return SupabasePermissionHelper.permissionFromId(role.id)
        }) ?? []
      )
    },
  )

  baseUrl: string =
    'https://xtaokvbipbsfiierhajp.supabase.co/storage/v1/object/public/'

  getPermissions(): Promise<(Permission | null)[]> {
    return this.userPermissionsCache.get()
  }

  teachingLevelsCache: Cacheable<Level[]> = new Cacheable(
    'teaching_levels',
    async () => {
      const permissions = await this.getPermissions()

      if (permissions.includes(Permission.GLOBAL_ADMIN)) {
        console.log('User is a global admin, returning all levels')

        return Level.LEVELS
      }

      if (!permissions.includes(Permission.TEACHER)) {
        console.log('User is not a teacher, returning empty array')

        return []
      }

      const { data, error } = await supabase
        .from('teachers')
        .select()
        .eq('user', this.user.value?.uuid)
        .maybeSingle()

      this.assertNoError(error, 'Fetching teaching levels failed')

      return data?.editable_levels?.map(SupabaseLevelHelper.getLevelById) ?? []
    },
  )

  getTeachingLevels(): Promise<Level[]> {
    return this.teachingLevelsCache.get()
  }

  async register(email: string, password: string): Promise<void> {
    console.log(`Send registration request with email ${email}`)

    let { error } = await supabase.auth.signUp(
      {
        email: email,
        password: password,
      },
      {
        redirectTo: window.location.host + '/validate-account',
      },
    )

    this.assertNoError(error, 'Registration request failed')

    console.log(
      'Registration request back without error, waiting for email confirmation',
    )

    /**
     * TODO-API: Here we cannot now if their was already an user with the same email.
     * (https://github.com/supabase/supabase-js/issues/296). So we should transfer
     * account creation in the API where the function createUser() is available and
     * return if an user with the same email already exists.
     */
  }

  async loginUsingToken(token: string): Promise<void> {
    const { user } = await supabase.auth.setAuth(token)

    await this.updateConnectionStatus()
  }

  async sendResetUserPassword(email: string): Promise<string | void> {
    const { error } = await supabase.auth.api.resetPasswordForEmail(email)

    if (error) return error.message
  }

  async resetPasswordWithToken(
    token: string,
    newPassword: string,
  ): Promise<string | void> {
    const { error } = await supabase.auth.api.updateUser(token, {
      password: newPassword,
    })

    if (error) return error.message
  }

  async login(email: string, password: string): Promise<void> {
    console.log(`Send login request with email ${email}`)

    const { error } = await supabase.auth.signIn({
      email: email,
      password: password,
    })

    this.assertNoError(error, 'Login request failed')
    console.log('Login request back without error')

    this.updateConnectionStatus()

    this.assertWorked(this.isConnected.value, TRY_AGAIN_LATER, 'Login')
    console.log('The user is now connected')
  }

  async logout(): Promise<void> {
    console.log('Trying to sign out')

    const { error } = await supabase.auth.signOut()

    this.assertNoError(error, 'Sign out request failed')
    console.log('Sign out request back without error')

    this.updateConnectionStatus()

    this.assertWorked(!this.isConnected.value, TRY_AGAIN_LATER, 'Sign out')
  }

  /* Program */
  programCache: Cacheable<SchoolProgram> = new Cacheable(
    'program',
    async () => {
      const { data, error } = await supabase
        .from('themes')
        .select()
        .eq('visible', true)

      this.assertNoError(error, 'Fetching school program failed')
      this.assertWorked(
        data != null,
        TRY_AGAIN_LATER,
        'Fetching school program',
      )

      const program: SchoolProgram = new SchoolProgram()

      data!!.forEach((theme) =>
        program.add(
          Level.levelFromIndex(theme.level)!!,
          SupabaseClient.themeFromData(theme),
        ),
      )

      return program
    },
  )

  getProgram(): Promise<SchoolProgram> {
    return this.programCache.get()
  }

  fullProgramCache: Cacheable<SchoolProgram> = new Cacheable(
    'full_program',
    async () => {
      const teachingLevels = await this.getTeachingLevels()

      if (teachingLevels.length === 0) {
        console.warn(
          'User asked for full program but he have not teaching levels',
        )
        return this.getProgram()
      }

      const { data, error } = await supabase
        .from('themes')
        .select()
        .in(
          'level',
          teachingLevels.map(SupabaseLevelHelper.getIdByLevel).map(String),
        )

      this.assertNoError(error, 'Fetching school full program failed')
      this.assertWorked(
        data != null,
        TRY_AGAIN_LATER,
        'Fetching full school program',
      )

      const program: SchoolProgram = new SchoolProgram()

      data!!.forEach((theme) =>
        program.add(
          Level.levelFromIndex(theme.level)!!,
          SupabaseClient.themeFromData(theme),
        ),
      )

      return program
    },
  )

  getAllProgram(): Promise<SchoolProgram> {
    return this.fullProgramCache.get()
  }

  async getThemeByUuid(uuid: string): Promise<Theme | null> {
    const program = await this.getProgram()

    return program.find((theme) => theme.uuid == uuid)
  }

  themeResourcesCache: Map<string, Cacheable<ThemeResource[]>> = new Map()
  async getThemeResources(uuid: string): Promise<ThemeResource[] | null> {
    if (
      !this.themeResourcesCache.has(uuid) &&
      (await this.fullProgramCache.get()).contains(uuid)
    ) {
      this.themeResourcesCache.set(
        uuid,
        new Cacheable(
          `theme_${uuid}`,
          async () => (await this.fetchThemeResources(uuid))!!,
        ),
      )
    }
    return this.themeResourcesCache.get(uuid)!!.get()
  }

  private async fetchThemeResources(
    uuid: string,
  ): Promise<ThemeResource[] | null> {
    // First we fetch the theme data
    const { data, error } = await supabase
      .from('themes_resources')
      .select(
        `
        uuid,
        date,
        name,
        message,
        correction,
        themes_resources_types (
          id,
          name
        ),
        visible
      `,
      )
      .eq('theme_uuid', uuid)

    this.assertNoError(error, 'Fetching resources of theme failed')
    this.assertWorked(
      data != null,
      TRY_AGAIN_LATER,
      'Fetching resources of theme',
    )

    const resources = data!!.map((resource: any) => ({
      uuid: resource.uuid,
      date: resource.date,
      name: resource.name,
      message: resource.message,
      correction: resource.correction,
      type: resource.themes_resources_types.name,
      visible: resource.visible,
    }))

    const resourcesIds = resources.map((resource) => resource.uuid)

    const { data: content, error: contentError } = await supabase
      .from('themes_resources_links')
      .select()
      .in('resource', resourcesIds)

    this.assertNoError(
      contentError,
      'Fetching content of resources of theme failed',
    )
    this.assertWorked(
      content != null,
      TRY_AGAIN_LATER,
      'Fetching content of resources of theme',
    )

    return resources.map((resource) => ({
      ...resource,
      content: content!!
        .filter((linkData) => linkData.resource === resource.uuid)
        .map((linkData) => {
          if (linkData.is_internal) {
            return {
              name: linkData.name,
              path: linkData.path,
              url: linkData.link,
            }
          } else {
            return {
              url: linkData.link,
            }
          }
        }),
    }))
  }

  themeResourcesTypesCache: Cacheable<ThemeResourceType[]> = new Cacheable(
    'theme_resources_types',
    async () => {
      const { data, error } = await supabase
        .from('themes_resources_types')
        .select()

      this.assertNoError(error, 'Fetching theme resources types failed')
      this.assertWorked(
        data != null,
        TRY_AGAIN_LATER,
        'Fetching theme resources types',
      )

      return data as ThemeResourceType[]
    },
  )
  async getThemeResourceTypes(): Promise<ThemeResourceType[]> {
    return this.themeResourcesTypesCache.get()
  }

  async createThemeResource(
    theme_uuid: string,
    name: string,
    message: string,
    type: string,
    corrected: boolean,
    files: ThemeResourceFile[],
  ): Promise<ThemeResource> {
    // First we check if the provided type exists, if not we insert it
    const resourcesTypes = await this.getThemeResourceTypes()
    let typeObject = resourcesTypes.find(
      (existingType) => existingType.name === type,
    )
    if (typeObject) {
      console.log(`Type ${type} already exists, increasing its usage`)

      const { error } = await supabase
        .from('themes_resources_types')
        .update({
          utilisations: typeObject.utilisations + 1 ?? 1,
        })
        .eq('id', typeObject.id)
      
      if (error) console.error(error)

      typeObject = {
        ...typeObject,
        utilisations: typeObject.utilisations + 1 ?? 1,
      }

      this.themeResourcesTypesCache.localUpdate((types) =>
        types.map((existingType) =>
          existingType.name === type ? typeObject!! : existingType,
        ),
      )
    } else {
      console.log(`Type ${type} does not exist, we create it`)

      const { data, error } = await supabase
        .from('themes_resources_types')
        .insert({
          name: type,
          utilisations: 1,
        })
        .maybeSingle()

      this.assertNoError(error, 'Creating theme resource type failed')
      console.log('Creating theme resource type back without error')

      typeObject = data

      this.themeResourcesTypesCache.localUpdate((types) => [
        ...types,
        { id: typeObject!!.id, name: type, utilisations: 1 },
      ])
    }

    // Then we insert the resource
    const { data, error } = await supabase
      .from('themes_resources')
      .insert({
        theme_uuid: theme_uuid,
        name: name,
        message: message,
        type: typeObject!!.id,
        correction: corrected,
        visible: true,
      })
      .maybeSingle()

    this.assertNoError(error, 'Creating theme resource failed')
    this.assertWorked(data != null, TRY_AGAIN_LATER, 'Creating theme resource')

    const resourceWithoutLinks = {
      ...data,
      date: timestampToFrenchDate(data.date),
      type: type,
    }
    const resourceContent = []

    // Then we upload the file and insert the link one by one
    for (const file of files) {
      const fileToUpload = (file as any).file
      let link = file.url

      // We upload the file if needed
      if (fileToUpload) {
        const { data, error } = await supabase.storage
          .from('themes-resources')
          .upload(
            `${theme_uuid}/${resourceWithoutLinks.uuid}/${fileToUpload.name}`,
            fileToUpload,
            {
              cacheControl: '3600',
            },
          )

        this.assertNoError(error, 'Uploading theme resource file failed')
        this.assertWorked(
          data != null,
          TRY_AGAIN_LATER,
          'Uploading theme resource file',
        )

        const { publicURL, error: errorOnUrl } = await supabase.storage
          .from('themes-resources')
          .getPublicUrl(
            `${theme_uuid}/${resourceWithoutLinks.uuid}/${fileToUpload.name}`,
          )

        this.assertNoError(
          errorOnUrl,
          'Getting public url of theme resource file failed',
        )
        this.assertWorked(
          publicURL != null,
          TRY_AGAIN_LATER,
          'Getting public url of theme resource file',
        )

        link = publicURL as string
      }

      const fileName = fileToUpload?.name ?? null
      const filePath = fileName
        ? `${theme_uuid}/${resourceWithoutLinks.uuid}/${fileName}`
        : null

      // And we add the link to the table
      const { data, error } = await supabase
        .from('themes_resources_links')
        .insert({
          link: link,
          is_internal: fileToUpload != null,
          name: fileName,
          path: filePath,
          resource: resourceWithoutLinks.uuid,
        })
        .maybeSingle()

      this.assertNoError(error, 'Creating theme resource link failed')
      this.assertWorked(
        data != null,
        TRY_AGAIN_LATER,
        'Creating theme resource link',
      )

      if (fileToUpload) {
        resourceContent.push({
          name: fileName,
          path: filePath,
          url: link,
        })
      } else {
        resourceContent.push({
          url: link,
        })
      }
    }

    const newResource = {
      ...resourceWithoutLinks,
      content: resourceContent,
    }

    this.themeResourcesCache
      .get(theme_uuid)!!
      .localUpdate((resources) => [...resources, newResource])

    return newResource
  }

  async changeThemeResourceVisibility(
    theme_uuid: string,
    resource_uuid: string,
    visible: boolean,
  ): Promise<void> {
    const { data, error } = await supabase
      .from('themes_resources')
      .update({
        visible: visible,
      })
      .eq('uuid', resource_uuid)
      .maybeSingle()

    this.assertNoError(error, 'Changing theme resource visibility failed')
    this.assertWorked(
      data != null,
      TRY_AGAIN_LATER,
      'Changing theme resource visibility',
    )

    const cache = this.themeResourcesCache.get(theme_uuid)
    const resource = (await cache?.get())?.find(
      (resource) => resource.uuid === resource_uuid,
    )
    if (resource) {
      cache?.localUpdate((resources) => [
        ...resources.filter((resource) => resource.uuid !== resource_uuid),
        { ...resource, visible: visible },
      ])
    }
  }

  async deleteThemeResource(
    theme_uuid: string,
    resource_uuid: string,
  ): Promise<void> {
    // First we delete the linked files in the storage
    const links = (await this.themeResourcesCache
      .get(theme_uuid)!!
      .get())!!.find((resource) => resource.uuid === resource_uuid)!!.content
    let promises = []
    for (const link of links) {
      if ((link as any).path) {
        promises.push(
          supabase.storage
            .from('themes-resources')
            .remove([(link as any).path!!])
            .then(({ error }) =>
              this.assertNoError(error, 'Deleting theme resource file failed'),
            ),
        )
      }

      // Then we delete the link in the table
      promises.push(
        supabase
          .from('themes_resources_links')
          .delete()
          .eq('resource', resource_uuid)
          .maybeSingle()
          .then(({ error }) =>
            this.assertNoError(error, 'Deleting theme resource link failed'),
          ),
      )
    }

    await Promise.all(promises).catch((error) =>
      this.assertNoError(
        error,
        'Deleting theme resource files and links failed',
      ),
    )

    // Finally we delete the resource
    const { data, error } = await supabase
      .from('themes_resources')
      .delete()
      .eq('uuid', resource_uuid)
      .maybeSingle()

    this.assertNoError(error, 'Deleting theme resource failed')

    // We decrease the utilisations counter of the resource type
    let utilisations = undefined
    let typeId = undefined
    this.themeResourcesTypesCache.localUpdate((types) =>
      types
        .map((type) => {
          if (type.id === data!!.type) {
            utilisations = type.utilisations - 1
            typeId = type.id
            return { ...type, utilisations: utilisations }
          }
          return type
        })
        .filter((type) => type.utilisations > 0),
    )

    if (utilisations === 0) {
      // We delete the resource type if there is no more utilisation
      const { data, error } = await supabase
        .from('themes_resources_types')
        .delete()
        .eq('id', typeId)
        .maybeSingle()

      this.assertNoError(error, 'Deleting theme resource type failed')
    } else {
      // We update the resource type if there is still utilisation
      const { data, error } = await supabase
        .from('themes_resources_types')
        .update({
          utilisations: utilisations,
        })
        .eq('id', typeId)
        .maybeSingle()

      this.assertNoError(error, 'Updating theme resource type failed')
    }

    const cache = this.themeResourcesCache.get(theme_uuid)
    const resource = (await cache?.get())?.find(
      (resource) => resource.uuid === resource_uuid,
    )
    if (resource) {
      cache?.localUpdate((resources) => [
        ...resources.filter((resource) => resource.uuid !== resource_uuid),
      ])
    }
  }

  async updateThemeResource(
    theme_uuid: string,
    resource_uuid: string,
    name: string,
    message: string,
    type: string,
    corrected: boolean,
    files: ThemeResourceFile[],
  ): Promise<ThemeResource> {
    // First we get the previous version of the resource
    const previous = (
      await this.themeResourcesCache.get(theme_uuid)?.get()
    )?.find((resource) => resource.uuid === resource_uuid)

    // We update the type utilisations counter if needed
    if (previous?.type !== type) {
      // First we increase the utilisations counter of the new type
      const usedType = (await this.themeResourcesTypesCache.get())?.find(
        (existingType) => existingType.name === type,
      )
      let newTypeId = undefined
      if (usedType) {
        // We increase the utilisations counter of the new type
        const { data, error } = await supabase
          .from('themes_resources_types')
          .update({
            utilisations: usedType.utilisations + 1,
          })
          .eq('id', usedType.id)
          .maybeSingle()

        this.assertNoError(error, 'Updating theme resource type failed')

        this.themeResourcesTypesCache.localUpdate((types) => [
          ...types.filter((type) => type.id !== usedType.id),
          { ...usedType, utilisations: usedType.utilisations + 1 },
        ])
      } else {
        // We create the new type if it doesn't exist
        const { data, error } = await supabase
          .from('themes_resources_types')
          .insert({
            name: type,
            utilisations: 1,
          })
          .maybeSingle()

        this.assertNoError(error, 'Creating theme resource type failed')

        this.themeResourcesTypesCache.localUpdate((types) => [...types, data])

        newTypeId = data!!.id
      }
      // We update the type of the resource NOW to avoid foreign key constraint error
      if (newTypeId) {
        const { data, error } = await supabase
          .from('themes_resources')
          .update({
            type: newTypeId,
          })
          .eq('uuid', resource_uuid)
          .maybeSingle()
      }

      // Then we decrease the utilisations counter of the previous type
      let utilisations = undefined
      let typeId = undefined

      this.themeResourcesTypesCache.localUpdate((types) =>
        types
          .map((type) => {
            if (type.name === previous!!.type) {
              utilisations = type.utilisations - 1
              typeId = type.id
              return { ...type, utilisations: utilisations }
            }
            return type
          })
          .filter((type) => type.utilisations > 0),
      )

      const { error } = await supabase
        .from('themes_resources_types')
        .update({
          utilisations: utilisations,
        })
        .eq('id', typeId)
        .maybeSingle()

      this.assertNoError(error, 'Updating theme resource type failed')

      // We delete the resource type if there is no more utilisation
      if (utilisations === 0) {
        // We delete the resource type if there is no more utilisation
        const { data, error } = await supabase
          .from('themes_resources_types')
          .delete()
          .eq('id', typeId)
          .maybeSingle()

        this.assertNoError(error, 'Deleting theme resource type failed')
      }
    }

    // Then we delete the deleted links/files
    const deletedLinks = previous?.content.filter(
      (link) =>
        !files.find((file) => {
          const sameURL = file.url && file.url == link.url
          const sameName =
            (file as any).name && (file as any).name == (link as any).name
          return sameURL || sameName
        }),
    )!!

    let promises = []
    for (const link of deletedLinks) {
      if ((link as any).path) {
        promises.push(
          supabase.storage
            .from('themes-resources')
            .remove([(link as any).path!!])
            .then(({ error }) =>
              this.assertNoError(error, 'Deleting theme resource file failed'),
            ),
        )
      }

      // And we delete the link in the table
      promises.push(
        supabase
          .from('themes_resources_links')
          .delete()
          .eq('link', link.url!!)
          .eq('resource', resource_uuid)
          .maybeSingle()
          .then(({ error }) =>
            this.assertNoError(error, 'Deleting theme resource link failed'),
          ),
      )
    }

    // In parallel we create the new links/files
    const newLinks = files.filter(
      (link) =>
        !previous?.content.find((file) => {
          const sameURL = file.url && file.url == link.url
          const sameName =
            (file as any).name && (file as any).name == (link as any).name
          return sameURL || sameName
        }),
    )!!
    // Then we upload the file and insert the link one by one
    for (const file of newLinks) {
      const fileToUpload = (file as any).file
      let link = file.url

      // We upload the file if needed
      if (fileToUpload) {
        const { data, error } = await supabase.storage
          .from('themes-resources')
          .upload(
            `${theme_uuid}/${resource_uuid}/${fileToUpload.name}`,
            fileToUpload,
            {
              cacheControl: '3600',
            },
          )

        file.url = supabase.storage
          .from('themes-resources')
          .getPublicUrl(
            `${theme_uuid}/${resource_uuid}/${fileToUpload.name}`,
          ).publicURL!!
        {
          ;(
            file as InternalThemeResourceFile
          ).path = `${theme_uuid}/${resource_uuid}/${fileToUpload.name}`
        }

        this.assertNoError(error, 'Uploading theme resource file failed')
        this.assertWorked(
          data != null,
          TRY_AGAIN_LATER,
          'Uploading theme resource file',
        )

        const { publicURL, error: errorOnUrl } = await supabase.storage
          .from('themes-resources')
          .getPublicUrl(`${theme_uuid}/${resource_uuid}/${fileToUpload.name}`)

        this.assertNoError(
          errorOnUrl,
          'Getting public url of theme resource file failed',
        )
        this.assertWorked(
          publicURL != null,
          TRY_AGAIN_LATER,
          'Getting public url of theme resource file',
        )

        link = publicURL as string
      }

      const fileName = fileToUpload?.name ?? null
      const filePath = fileName
        ? `${theme_uuid}/${resource_uuid}/${fileName}`
        : null

      // And we add the link to the table
      promises.push(
        supabase
          .from('themes_resources_links')
          .insert({
            link: link,
            is_internal: fileToUpload != null,
            name: fileName,
            path: filePath,
            resource: resource_uuid,
          })
          .maybeSingle()
          .then(({ error }) =>
            this.assertNoError(error, 'Inserting theme resource link failed'),
          ),
      )
    }

    // Then we update the resource
    const { data, error } = await supabase
      .from('themes_resources')
      .update({
        name: name,
        message: message,
        correction: corrected,
      })
      .eq('uuid', resource_uuid)
      .maybeSingle()

    this.assertNoError(error, 'Updating theme resource failed')
    this.assertWorked(data != null, TRY_AGAIN_LATER, 'Updating theme resource')

    let updated: ThemeResource
    // And its cache
    this.themeResourcesCache.get(theme_uuid)?.localUpdate((resources) =>
      resources.map((resource) => {
        if (resource.uuid === resource_uuid) {
          updated = {
            ...resource,
            name,
            message,
            correction: corrected,
            type,
            content: files,
          }
          return updated
        }
        return resource
      }),
    )

    return updated!!
  }

  async getPreviewDataOfURL(url: string): Promise<PreviewData> {
    console.log(`Computing server-side preview data of url ${url}`)

    const { data, error } = await supabase.functions.invoke('preview-url', {
      body: JSON.stringify({ url: url }),
    })

    this.assertNoError(error, 'Fetching preview data failed')

    console.log(`Computed server-side preview data of url ${url}`, data)

    return {
      title: data!!.title,
      description: data!!.description,
      image: data!!.image,
    }
  }

  async createTheme(
    name: string,
    description: string,
    level: Level,
  ): Promise<Theme> {
    console.log(`Creating theme ${name}`)

    const { data, error } = await supabase
      .from('themes')
      .insert({
        name: name,
        description: description,
        level: SupabaseLevelHelper.getIdByLevel(level),
        visible: false,
      })
      .maybeSingle()

    this.assertNoError(error, 'Creating theme failed')
    this.assertWorked(data != null, TRY_AGAIN_LATER, 'Creating theme')

    const createdTheme = SupabaseClient.themeFromData(data)

    console.log(`Created theme ${createdTheme}`)

    const updateProgram = (previous: SchoolProgram) => {
      const newProgram = previous.clone()
      newProgram.add(level, createdTheme)
      return newProgram
    }

    this.programCache.localUpdate(updateProgram)
    this.fullProgramCache.localUpdate(updateProgram)

    return createdTheme
  }

  async updateTheme(uuid: string, theme: Theme): Promise<Theme> {
    console.log(`Updating theme of uuid ${uuid}`)

    const { data, error } = await supabase
      .from('themes')
      .update({
        name: theme.name,
        description: theme.description,
        level: SupabaseLevelHelper.getIdByLevel(theme.level),
        visible: theme.visible,
        resources_with_correction: theme.numberOfCorrections,
      })
      .eq('uuid', theme.uuid)
      .maybeSingle()

    this.assertNoError(error, 'Updating theme failed')
    this.assertWorked(data != null, TRY_AGAIN_LATER, 'Updating theme')

    const updatedTheme = SupabaseClient.themeFromData(data)

    console.log(`Updated theme ${updatedTheme.uuid}`)

    const updateProgram = (previous: SchoolProgram) => {
      const newProgram = previous.clone()
      newProgram.updateTheme(uuid, updatedTheme)
      return newProgram
    }

    this.programCache.localUpdate(updateProgram)
    this.fullProgramCache.localUpdate(updateProgram)

    return updatedTheme
  }

  async deleteTheme(uuid: string): Promise<void> {
    console.log(`Deleting theme of uuid ${uuid}`)

    const promises = []

    // We delete all the resources of the theme
    for (const resource of (await this.getThemeResources(uuid))!!) {
      promises.push(this.deleteThemeResource(uuid, resource.uuid))
    }

    await Promise.all(promises)

    const { error } = await supabase
      .from('themes')
      .delete()
      .eq('uuid', uuid)
      .maybeSingle()

    this.assertNoError(error, 'Deleting theme failed')

    const updateProgram = (previous: SchoolProgram) => {
      const newProgram = previous.clone()
      newProgram.deleteTheme(uuid)
      return newProgram
    }

    this.programCache.localUpdate(updateProgram)
    this.fullProgramCache.localUpdate(updateProgram)
  }

  // The value of this ref is the fetched files
  files: Ref<CustomFile[]> = ref([])

  // The number of fetched news (Laurian, j'ai mis 10 au pif, il fallait une valeur)
  numberOfNews: Ref<number> = ref(10)

  // The value of this ref is the fetched repositories
  repositories: Ref<Repository[]> = ref([])

  /* -------------------------------------------------------------------------- */
  /*                The value of this ref is fetched permissions                */
  /* -------------------------------------------------------------------------- */
  fetchedMessages: Ref<Message[]> = ref([])

  /* -------------------------------------------------------------------------- */
  /*    The email of the connected user or null if the user is not connected    */
  /* -------------------------------------------------------------------------- */
  email: Ref<string | null> = ref(null)

  /* -------------------------------------------------------------------------- */
  /*                 The uuid of the connected user or null                     */
  /* -------------------------------------------------------------------------- */
  uuid: Ref<string | null> = ref(null)

  /* -------------------------------------------------------------------------- */
  /*                 The username of the connected user or null                 */
  /* -------------------------------------------------------------------------- */
  username: Ref<string | null> = ref(null)

  accountCreationDate: Ref<string | null> = ref(null)

  /* -------------------------------------------------------------------------- */
  /*          // The last connection date of the connected user or null         */
  /* -------------------------------------------------------------------------- */
  last_date: Ref<string | null> = ref(null)

  // The value of this ref is the fetched messages
  messages: Ref<Repository[]> = ref([])

  /**
   * A list of news fetched from the database.
   * This list is updated when the method fetchNews(quantity) is called
   */
  fetchedNews: Ref<Array<News>> = ref(Array())
  private newsOffset: number = 0
  maxNewsReached: Ref<boolean> = ref(false)

  /* -------------------------------------------------------------------------- */
  /*             A list of history points fetched from the database             */
  /* -------------------------------------------------------------------------- */
  fetchedHistoryPoints: Ref<HistoryPoint[]> = ref([])

  /* -------------------------------------------------------------------------- */
  /*           A list of messages from users fetched from the database          */
  /* -------------------------------------------------------------------------- */
  fetchedUserMessages: Ref<UserMessage[]> = ref([])

  /**
   * Public  method to update the data of the user. For the moment it updates :
   *  - Connection status
   *  - User email
   *  - Permissions
   */
  async updateConnectionStatus() {
    console.log('Updating connection status')

    const isConnected = supabase.auth.session() != null
    this.isConnected.value = isConnected

    this.userPermissionsCache.invalidate()
    this.teachingLevelsCache.invalidate()

    if (!isConnected) {
      console.log("User isn't connected")
      return
    } else {
      console.log('User is connected')
    }

    this.user.value = new SupabaseUser(
      supabase.auth.user()?.email!,
      supabase.auth.user()?.id!,
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
            news['subtitle'],
            news['content'],
            LongDate.ISOStringToLongDate(news['date']),
            concerned,
            news['visible'],
            news['imageUrls'],
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
            historyPoint['subtitle'],
            historyPoint['content'],
            historyPoint['date'],
            historyPoint['visible'],
            historyPoint['imageUrls'],
          ),
        )
      })

      this.fetchedHistoryPoints.value.sort((a, b) => b.date - a.date)
    } catch (error) {
      console.log(`Error while fetching history points`, error)
    }
  }

  async fetchOneHistoryPoint(id: number): Promise<HistoryPoint | undefined> {
    const { data, error } = await supabase
      .from('history_points')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) console.error(error.message)
    else return data
  }

  async fetchOneNew(id: number): Promise<News | undefined> {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) {
      console.error(error.message)
    } else {
      return data
    }
  }

  async getDeposits(id?: number): Promise<Repository[]> {
    console.log('Trying to fetch deposits in the database')

    try {
      const { data, error } = await supabase.from('themes').select('*')

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
        date: new Date(),
      },
    ])

    if (error) {
      throw error.message
    }

    const addedNews = new SupabaseNews(
      data[0]['id'],
      data[0]['title'],
      data[0]['subtitle'],
      data[0]['content'],
      LongDate.ISOStringToLongDate(data[0]['date']),
      data[0]['concerned'],
      data[0]['visible'],
      data[0]['imageUrls'],
    )

    console.log('Added one news in the database', addedNews)

    this.fetchedNews.value.push(addedNews)
    this.newsOffset += 1

    return addedNews
  }

  async RecieveMessage(
    name: string,
    email: string,
    message: string,
  ): Promise<UserMessage> {
    console.log('Trying to add message in the database')

    const { data, error } = await supabase.from('messages_user').insert([
      {
        date: new Date(),
        message: message,
        email: email,
        name: name,
        HasBeenRead: false,
      },
    ])

    if (error) {
      throw error.message
    }

    const recievedMessage = new SupabaseUserMessage(
      LongDate.ISOStringToLongDate(data[0]['date']),
      data[0]['message'],
      data[0]['email'],
      data[0]['name'],
      data[0]['HasBeenRead'],
    )

    console.log('Recieved one message in the database', recievedMessage)

    this.fetchedUserMessages.value.push(recievedMessage)
    this.fetchedUserMessages.value.sort(
      (a, b) => -1 * LongDate.compare(a.date, b.date),
    )

    return recievedMessage
  }

  async createEmptyHistoryPoint(title: string): Promise<HistoryPoint> {
    console.log('Trying to create an empty history point in the database')

    const { data, error } = await supabase.from('history_points').insert([
      {
        title: title,
        imageUrls: [],
      },
    ])

    if (error) {
      console.log('Error while creating history point', error)
      throw error.message
    }

    const addedHistoryPoint = new SupabaseHistoryPoint(
      data[0]['id'],
      data[0]['title'],
      data[0]['subtitle'],
      data[0]['content'],
      data[0]['date'],
      data[0]['visible'],
      data[0]['imageUrls'],
    )

    console.log('Added one history point in the database', addedHistoryPoint)

    this.fetchedHistoryPoints.value.push(addedHistoryPoint)
    this.fetchedHistoryPoints.value.sort((a, b) => {
      return b.date - a.date
    })

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

  /**
   * Uploads an image to a storage bucket
   * @param file The file in the native JS format
   * @param folders The folders to go
   * @returns The URL of the uploaded image
   */
  async uploadImage(file: File, ...folders: string[]): Promise<any> {
    // Removes the bad caracters from the file name
    const newName = removeBadChars(file.name).replaceAll(' ', '_')
    // Renames the folders and replaces whitespaces with underscores
    const escapedFolderName = folders
      .map((folder) => {
        return removeBadChars(folder).replaceAll(' ', '_')
      })
      .join('/')

    // Recreate the file with the clean name
    const escapedFile = new File([file], newName, { type: file.type })

    // Uploads data to the storage bucket and adds a 3 digits number ahead the name
    const { data, error } = await supabase.storage
      .from('images')
      .upload(
        escapedFolderName + '/' + newName + '_' + Math.random() * 1000,
        escapedFile,
        {
          cacheControl: '3600',
          upsert: false,
        },
      )

    if (data) return { data: this.baseUrl + data.Key, error: null }
    if (error) return { data: null, error: error.message }
  }

  /**
   * Removes an image of a storage bucket
   * @param url The url of the ressource
   * @param folders The folders to go
   * @returns The URL of the uploaded image
   */
  async deleteImage(url: string, ...folders: string[]): Promise<any> {
    // Removes the bad caracters from the path
    const path = removeBadChars(url.replaceAll(this.baseUrl, '')).replaceAll(
      ' ',
      '_',
    )

    const { error } = await supabase.storage.from('images').remove([path])

    if (!error) return { error: null }
    return { error: error.message }
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
    const newName = removeBadChars(fileName || file.name)

    // Removes the bad caracters from the deposit name
    const cleanDepositName = removeBadChars(deposit)

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
        date: new Date(),
        title: news.title,
        visible: news.visible,
        concerned: news.concerned.map(SupabaseLevelHelper.getIdByLevel),
        content: news.content,
        subtitle: news.subtitle,
        imageUrls: news.imageUrls,
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
        date: historyPoint.date,
        title: historyPoint.title,
        subtitle: historyPoint.subtitle,
        imageUrls: historyPoint.imageUrls,
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

  async getAllUsers(): Promise<any> {
    // Requests profiles
    let [
      { data, error },
      { data: users, error: userError },
      { data: levels, error: levelsError },
    ] = await Promise.all([
      supabase.from('roles').select(),
      supabase.from('users').select(),
      supabase.from('teachers').select(),
    ])

    if (error) return console.error(error)
    if (levelsError) return console.error(levelsError)
    if (userError) return console.error(userError)

    data =
      data?.map(({ id, users: uuids }) => {
        if (uuids == null) uuids = []
        return {
          id: id,
          users: uuids.map((uuid: string) => {
            const user = getElementsInArrayByKeyValue(users!!, 'id', uuid)[0]
            user.levels =
              getElementsInArrayByKeyValue(levels!!, 'user', uuid)[0]
                ?.editable_levels ?? []
            return user
          }),
        }
      }) ?? null

    console.log('Final data :', data)

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

  async addUserToRole(
    uuid: string,
    newRole: number,
    oldRole: number,
  ): Promise<boolean> {
    const { error } = await supabase.rpc('add_user_to_role', {
      uuid: uuid,
      role: newRole,
    })

    const { error: deletionError } = await supabase.rpc('remove_user_to_role', {
      uuid: uuid,
      role: oldRole,
    })

    if (deletionError) throw deletionError.message
    if (error) throw error.message

    return true
  }

  async checkLevelForUser(uuid: string, level: number): Promise<any> {
    const { error } = await supabase.rpc('update_user_levels', {
      user_uuid: uuid,
      level: level,
    })

    if (error) throw error.message
  }

  async uncheckLevelForUser(uuid: string, level: number): Promise<any> {
    const { error } = await supabase.rpc('remove_user_levels', {
      user_uuid: uuid,
      level: level,
    })

    if (error) throw error.message
  }

  private static themeFromData(data: any): Theme {
    return {
      uuid: data.uuid,
      date: data.date,
      name: data.name,
      description: data.description,
      level: SupabaseLevelHelper.getLevelById(data.level),
      visible: data.visible,
      numberOfCorrections: data.resources_with_correction,
    }
  }

  private assertNoError(
    error: Error | ApiError | PostgrestError | null,
    message: string,
  ): void {
    if (error) {
      console.error(message, error)
      throw error.message
    }
  }

  private assertWorked(
    condition: boolean,
    message: string,
    task: string,
  ): void {
    if (!condition) {
      console.error(`Task "${task}" failed: ${message}`)
      throw message
    }
  }
}

import type { User, email, username, uuid } from '../interface/user'
import type { Permission } from '../interface/permissions'
import { databaseClient } from '../implementation'
import { supabase } from './supabase_client'
import { SupabasePermissionHelper } from './supabase_permission_helper'
import { watch } from 'vue'

export class SupabaseUser implements User {
  email: email
  uuid: uuid

  fetchedPermissions: Permission[] | null = null
  fetchedUsername: string | null = null

  constructor(
    email: email,
    uuid: uuid,
  ) {
    this.email = email
    this.uuid = uuid
  }

  async getPermissions(): Promise<(Permission | null)[]> {
    console.log("Fetching user's permissions")

    if (this.fetchedPermissions) {
      console.log("User's permissions already fetched, returning cached value")
      return this.fetchedPermissions
    }

    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .contains('users', this.uuid)

      if (error) {
        throw error
      }

      if (!data) {
        throw 'Data returned by the request is null'
      }

      // TODO-TEST: Assert there is no changes that are not reflected in the database
      return data?.map((row) => SupabasePermissionHelper.permissionFromId(row.id))
    } catch (error) {
      console.log('Error while updating user infos', error)

      throw error
    }
  }

  async getUsername(): Promise<string> {
    console.log("Fetching user's username")

    if (this.fetchedUsername) {
      console.log("User's username already fetched, returning cached value")
      return this.fetchedUsername
    }

    try {
      // TODO-API:, replace this by a call to the API
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('user', supabase.auth.user()?.id)
        .maybeSingle()

      if (error) {
        throw error
      }

      if (!data) {
        throw 'Data returned by the request is null'
      }

      return data.username
    } catch (error) {
      console.log('Error while updating user infos', error)

      throw error
    }
  }
}

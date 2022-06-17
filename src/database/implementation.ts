import { SupabaseClient } from '../database/supabase/supabase'
import type { DatabaseClient } from './interface/database_client'

export const databaseClient: DatabaseClient = new SupabaseClient()

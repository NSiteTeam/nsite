import ManageProgram from './ManageProgram.vue'
import ManageHistoryPoints from '@/views/dashboard/ManageHistoryPoints.vue'

export type DashboardView = {
  name: string
  nameInUrl: string
  icon: string
  view: any
}

export const PROGRAM_VIEW = {
  name: 'Program',
  nameInUrl: 'themes',
  icon: 'topic',
  view: ManageProgram,
}
export const NEWS_VIEW = {
  name: 'Actualités',
  nameInUrl: 'actualites',
  icon: 'newspaper',
}
export const HISTORY_VIEW = {
  name: 'Histoire',
  nameInUrl: 'histoire',
  icon: 'timeline',
  view: ManageHistoryPoints,
}
export const USERS_VIEW = {
  name: 'Utilisateurs',
  nameInUrl: 'utilisateurs',
  icon: 'manage_accounts',
}

import ManageProgram from './ManageProgram.vue'
import ManageHistoryPoints from '@/views/dashboard/ManageHistoryPoints.vue'
import ManageNews from '@/views/dashboard/ManageNews.vue'
import ManageUsers from './ManageUsers.vue'
// import ManageNews from '@/views/dashboard/ManageNews.vue'

export type DashboardView = {
  name: string
  nameInUrl: string
  icon: string
  tooltip: string
  view: any
}

export const PROGRAM_VIEW = {
  name: 'Program',
  nameInUrl: 'themes',
  icon: 'topic',
  view: ManageProgram,
  tooltip: '📕 Thèmes'
}
export const NEWS_VIEW = {
  name: 'Actualités',
  nameInUrl: 'actualites',
  icon: 'newspaper',
  view: ManageNews,
  tooltip: '📰 Actualités'
}
export const HISTORY_VIEW = {
  name: 'Histoire',
  nameInUrl: 'histoire',
  icon: 'timeline',
  view: ManageHistoryPoints,
  tooltip: '📜 Histoire'
}
export const USERS_VIEW = {
  name: 'Utilisateurs',
  nameInUrl: 'utilisateurs',
  icon: 'manage_accounts',
  view: ManageUsers,
  tooltip: '👨 Utilisateurs'
}

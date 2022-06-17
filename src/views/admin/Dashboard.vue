<script lang="ts" setup>
// @ts-ignore
import ManageDeposits from '@/components/dashboard/ManageDeposits.vue'
// @ts-ignore
import ManageUsers from '@/components/dashboard/ManageUsers.vue'
// @ts-ignore
import Blacklist from '@/components/dashboard/Blacklist.vue'
// @ts-ignore
import ManageNews from '@/components/dashboard/ManageNews.vue'
// @ts-ignore
import ManageHistoryPoints from '@/components/dashboard/ManageHistoryPoints.vue'
import { computed } from 'vue'
import { ref } from 'vue'
import { databaseClient } from '@/database/implementation'
import type { Ref } from 'vue'
import type { Repository } from '@/database/interface/repositories'
import { useRoute } from 'vue-router'
import { getParameterOfRoute } from '@/utils/route_utils'
import { Permission } from '@/database/interface/permissions'
import NothingAdviable from '@/components/dashboard/NothingAdviable.vue'
import SelectView from '@/components/dashboard/SelectView.vue'
import router from '@/router'
import WorkInProgress from '@/components/dashboard/WorkInProgress.vue'

const availableViewsForUser = computed(() => {
  let result: View[] = []
  const permissions = databaseClient.user.value?.permissions

  if (permissions == null) {
    return result
  }

  for (let permission of permissions) {
    switch (permission) {
      case Permission.STUDENT:
        result.push(View.FORBIDDEN)
      case Permission.TEACHER:
        result.push(View.DEPOSITS)
        result.push(View.BLACKLIST)
        break
      case Permission.HISTORY_ADMIN:
        result.push(View.HISTORY)
        break
      case Permission.NEWS_ADMIN:
        result.push(View.NEWS)
        break
      case Permission.GLOBAL_ADMIN:
        result.push(View.TEACHERS)
        result.push(View.USERS)
        break
      default:
        result = [View.FORBIDDEN]
    }
  }

  return result
})

const noViewsAvailable = computed(
  () => View.viewFromName(getParameterOfRoute(useRoute().params.view)) != null,
)

const component = computed(() => {
  const viewName = getParameterOfRoute(useRoute().params.view)
  if (!viewName && availableViewsForUser.value.length > 0) {
    return SelectView
  } else if (
    availableViewsForUser.value.length == 0
  ) {
    return NothingAdviable
  }
  const view = View.viewFromName(viewName)
  if (view == null) {
    if (availableViewsForUser.value.length > 0) {
      console.log(
        'Switched view to "' + availableViewsForUser.value[0].name + '"',
      )
      router.push('/dashboard/' + availableViewsForUser.value[0].nameInURL)
      return availableViewsForUser.value[0].component
    } else {
      return SelectView
    }
  }

  return view.component
})

class View {
  name: string // Name of the material design icon
  nameInURL: string
  icon: string
  component: any

  private constructor(
    name: string,
    nameInURL: string,
    icon: string,
    component: any,
  ) {
    this.name = name
    this.nameInURL = nameInURL
    this.icon = icon
    this.component = component
  }

  static viewFromName(name: string): any {
    for (let view of [
      this.DEPOSITS,
      this.NEWS,
      this.HISTORY,
      this.THEMES,
      this.TEACHERS,
      this.USERS,
      this.BLACKLIST,
    ]) {
      if (view.nameInURL == name) {
        return view
      }
    }

    return noViewsAvailable ? this.FORBIDDEN : null
  }

  static DEPOSITS = new View(
    'Depôts de ressources',
    'deposits',
    'folder',
    ManageDeposits,
  )
  static NEWS = new View('Actualités', 'news', 'newspaper', ManageNews)
  static HISTORY = new View(
    "Points d'histoire",
    'historypoints',
    'calendar_month',
    ManageHistoryPoints,
  )
  static THEMES = new View(
    "Thèmes de l'année",
    'themes',
    'subject',
    WorkInProgress,
  )
  static TEACHERS = new View(
    'Enseignants',
    'teachers',
    'school',
    WorkInProgress,
  )
  static USERS = new View(
    'Utilisateurs',
    'users',
    'manage_accounts',
    ManageUsers,
  )
  static BLACKLIST = new View(
    'Liste noire',
    'blacklist',
    'receipt_long',
    Blacklist,
  )
  static FORBIDDEN = new View(
    'Passez votre chemin',
    'access_denied',
    'dangerous',
    NothingAdviable,
  )
}
</script>

<template>
  <div id="dashboard-container">
    <nav id="dashboard-navbar">
      <RouterLink
        v-for="view in availableViewsForUser"
        :key="view.name"
        :to="'/dashboard/' + view.nameInURL"
      >
        <div id="menu-box">
          <span id="menu-icon" class="material-icons">
            {{ view.icon }}
          </span>
          <span id="menu-tooltip">
            {{ view.name }}
          </span>
        </div>
      </RouterLink>
    </nav>

    <component :is="component" />
  </div>
</template>

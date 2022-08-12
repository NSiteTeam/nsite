<template>
  <template v-if="hasAccessToDashboard">
    <div class="flex h-main w-screen flex-row overflow-y-scroll">
      <!--Icons column-->
      <div class="h-main w-min border-r-2 border-gray-100 p-2">
        <template v-for="view in views" :key="view.nameInURL">
          <div class="relative">
            <div
              class="center m-2 h-12 w-12 rounded-lg p-2 transition-all"
              :class="{
                'text-gray-800 hover:bg-gray-200': !isCurrentView(view),
                'translate-x-1 bg-gray-800 text-white hover:bg-gray-700':
                  isCurrentView(view),
              }"
              @click="select(view)"
            >
              <Icon :icon="view.icon" 2xl />
            </div>
            <div
              class="absolute -left-2 w-1 rounded-r-full bg-gray-800 transition-all duration-500"
              :class="{
                'top-0 h-12': isCurrentView(view),
                'top-6 h-0': !isCurrentView(view),
              }"
            ></div>
          </div>
        </template>
      </div>
      <div class="min-w-0 flex-1">
        <component :is="currentView.view" />
      </div>
    </div>
  </template>

  <template v-else>
    <PageError forbidden />
  </template>
</template>

<script lang="ts" setup>
// @ts-ignore
import MediumTitle from '@/components/style/MediumTitle.vue'
// @ts-ignore
import PageError from '@/views/40x/40x.vue'
// @ts-ignore
import Icon from '@/components/style/Icon.vue'
import { databaseClient } from '@/database/implementation'
import { computed, ref } from 'vue'
import { Permission } from '@/database/interface/permissions'
import { HISTORY_VIEW, NEWS_VIEW, PROGRAM_VIEW, USERS_VIEW } from './views'
import type { DashboardView } from './views'
import { useRoute, useRouter } from 'vue-router'
import { MessageStack, MessageType } from '@/views/messages/message_stack'

const permissions = await databaseClient
  .getPermissions()
  .catch(MessageStack.logError)
const route = useRoute()
const router = useRouter()

const hasAccessToDashboard = ref(
  databaseClient.isConnected && permissions!!.length > 0,
)

const views = computed(() => {
  if (permissions!!.includes(Permission.GLOBAL_ADMIN)) {
    return [PROGRAM_VIEW, NEWS_VIEW, HISTORY_VIEW, USERS_VIEW]
  }

  const result = []

  if (permissions!!.includes(Permission.TEACHER)) result.push(PROGRAM_VIEW)
  if (permissions!!.includes(Permission.NEWS_ADMIN)) result.push(NEWS_VIEW)
  if (permissions!!.includes(Permission.HISTORY_ADMIN)) result.push(HISTORY_VIEW)

  return result
})

const currentView = computed(
  () =>
    views.value.find((view) => view.nameInUrl === route.params.view) ??
    views.value[0] ??
    null,
)

function isCurrentView(view: DashboardView) {
  return currentView.value?.nameInUrl === view.nameInUrl
}

function select(view: DashboardView) {
  router.push({ name: 'dashboard', params: { view: view.nameInUrl } })
}
</script>

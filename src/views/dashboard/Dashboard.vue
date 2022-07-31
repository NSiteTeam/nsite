<template>

  <template v-if='hasAccessToDashboard'>
    <div class='h-main w-screen flex flex-row overflow-y-clip'>
      <!--Icons column-->
      <div class='border-r-2 border-gray-100 w-min h-main p-2'>
        <template v-for='view in views' :key='view.nameInURL'>
          <div class='relative'>
            <div
              class='m-2 p-2 rounded-lg center h-12 w-12 transition-all'
              :class="{
                'text-gray-800 hover:bg-gray-200': !isCurrentView(view),
                'bg-gray-800 text-white translate-x-1 hover:bg-gray-700': isCurrentView(view),
              }"
              @click='select(view)'
            >
              <Icon
                :icon='view.icon'
                2xl
              />
            </div>
            <div
              class='w-1 bg-gray-800 absolute rounded-r-full -left-2 transition-all duration-500'
              :class="{
                'h-12 top-0': isCurrentView(view),
                'h-0 top-6': !isCurrentView(view),
              }"
            ></div>
          </div>

        </template>
      </div>
      <div class='flex-1 min-w-0'>
        <component :is='currentView.view'/>
      </div>
    </div>
  </template>

  <template v-else>
    <PageError forbidden />
  </template>

</template>

<script lang="ts" setup>
  import MediumTitle from '@/components/style/MediumTitle.vue'
  import PageError from '@/views/40x/40x.vue'
  import Icon from '@/components/style/Icon.vue'
  import { databaseClient } from '@/database/implementation'
  import { computed, ref } from 'vue'
  import { Permission } from '@/database/interface/permissions'
  import { HISTORY_VIEW, NEWS_VIEW, PROGRAM_VIEW, USERS_VIEW } from './views'
  import type { DashboardView } from './views'
  import { useRoute, useRouter } from 'vue-router'
  import { MessageStack, MessageType } from '@/views/messages/message_stack'

  const permissions = await databaseClient.getPermissions().catch(MessageStack.logError)
  const route = useRoute()
  const router = useRouter()

  const hasAccessToDashboard = ref(
    databaseClient.isConnected && permissions.length > 0
  )

  const views = computed(() => {
    if (permissions.includes(Permission.GLOBAL_ADMIN)) {
      return [PROGRAM_VIEW, NEWS_VIEW, HISTORY_VIEW, USERS_VIEW]
    }

    const result = []

    if (permissions.includes(Permission.TEACHER)) result.push(PROGRAM_VIEW)
    if (permissions.includes(Permission.NEWS_ADMIN)) result.push(NEWS_VIEW)
    if (permissions.includes(Permission.HISTORY_ADMIN)) result.push(HISTORY_VIEW)

    return result
  })

  const currentView = computed(() =>
    views.value.find(view => view.nameInUrl === route.params.view) ?? views.value[0] ?? null
  )

  function isCurrentView(view: DashboardView) {
    return currentView.value?.nameInUrl === view.nameInUrl
  }

  function select(view: DashboardView) {
    router.push({ name: 'dashboard', params: { view: view.nameInUrl } })
  }
</script>

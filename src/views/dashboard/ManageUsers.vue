<template>
  <div class="flex w-full justify-between">
    <DataColumn title="Utilisateurs">
      <div
        class="bold min-w-96 my-4 cursor-pointer p-2 text-gray-700"
        :class="{
          'rounded-lg bg-gray-200': selectedPermission == 0,
        }"
        @click="selectPermission(0)"
      >
        Utilisateur lambda
      </div>
      <div
        class="bold min-w-96 my-4 cursor-pointer p-2 text-gray-700"
        :class="{
          'rounded-lg bg-gray-200': selectedPermission == permission,
        }"
        v-for="(permission, index) in [1, 2, 3, 4]"
        :key="index"
        @click="selectPermission(permission)"
      >
        {{ getPermFromId(permission) }}
      </div>
    </DataColumn>
    <div class="w-full">
      <div class="flex items-center justify-between">
        <h1 class="font-bold text-2xl p-2">Utilisateurs</h1>
        <SearchInput class="m-4 p-1" v-model="searchedText" />
      </div>
      <div class="flex flex-1 flex-col px-4 py-2 font-bold text-gray-800">
        <div
          class="my-1 flex w-full cursor-pointer justify-between rounded-lg p-2 transition-all hover:bg-primary/95 child:hover:text-white"
          v-for="(user, index) in usersWithSelectedPerms"
          :key="index"
        >
          <span>
            {{ user.username }}
          </span>
          <div
            class="flex font-bold text-gray-800"
            v-for="(permission, index) in user.permissions"
            :key="index"
          >
            {{ getPermFromId(permission) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import DataColumn from './DataColumn.vue'
// @ts-ignore
import SearchInput from '../program/SearchInput.vue'
import { databaseClient } from '@/database/implementation'
import { computed, ref, shallowRef, toRaw } from 'vue'
import { SupabasePermissionHelper } from '@/database/supabase/supabase_permission_helper'
import { MessageStack, MessageType } from '../messages/message_stack'

const users = ref<any[]>()
const selectedPermission = ref<number>(1)
const searchedText = ref<string>('')

function selectPermission(permId: number) {
  selectedPermission.value = permId
  console.log(`Selected permission ${permId}`)
}

function selectUser(userToSelect: any) {
  console.log(`Selected any ${userToSelect}`)
}

function getPermFromId(id: number) {
  if (!id) return 'Élève lambda'
  return SupabasePermissionHelper.permissionFromId(id)
}

await databaseClient
  .getAllUsers()
  .then((fetchedUsers) => {
    users.value = fetchedUsers
  })
  .catch(() => {
    MessageStack.getInstance().push({
      text: "Quelque chose s'est mal passé",
      type: MessageType.SUCCESS,
    })
  })

const usersWithSelectedPerms = computed(() => {
  return users.value?.filter(
    (user) =>
      [...toRaw(user.permissions)].includes(selectedPermission.value) &&
      (searchedText.value
        ? user.username.toLowerCase().includes(searchedText.value)
        : true),
  )
})
</script>

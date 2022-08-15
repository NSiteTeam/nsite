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
        Utilisateur
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
        <h1 class="p-2 text-2xl font-bold">Utilisateurs</h1>
        <SearchInput
          class="m-4 p-1"
          v-model="searchedText"
          placeholder="Jean-Jacques ..."
        />
      </div>
      <div class="flex flex-1 flex-col px-4 py-2 font-bold text-gray-800">
        <div
          class="my-1 flex w-full cursor-pointer justify-between rounded-lg p-2 transition-all hover:bg-primary/95 child:hover:text-white"
          v-for="(user, index) in usersWithSelectedPerms"
          :key="index"
          @click="selectUser(user)"
        >
          <span>
            {{ user.email }}
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
      <RightPanel
        :isOpen="selectedUser ? true : false"
        @cancel="() => selectUser(null)"
        :title="'Modifier le profil de ' + selectedUser?.username"
        description="
          Si vous constatez qu'un utilisateur a un pseudonyme offenssant, 
          n'hésitez-pas à le changer. C'est aussi sur ce panneau que vous pouvez 
          modifier les rôles d'un utilisateur.
        "
      >
        <div class="bold text-xl text-gray-800">Nom d'utilisateur</div>
        <InputField
          v-if="selectedUser ? true : false"
          type="text"
          placeholder="Nom d'utilisateur"
          v-model="selectedUser.username"
        />

        <div class="text-xl font-bold text-gray-800">Permissions</div>
        <label
          class="color-gray-800 m-4 flex"
          v-for="(permission, index) in [1, 2, 3, 4]"
          :key="index"
        >
          <input
            v-if="selectedUser ? true : false"
            type="checkbox"
            class="m-1 block"
            :name="permission"
            :checked="selectedUser.permissions.includes(permission)"
          />
          <div class="text-lg font-bold text-gray-800">
            {{ getPermFromId(permission) }}
          </div>
        </label>
      </RightPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import DataColumn from './DataColumn.vue'
// @ts-ignore
import SearchInput from '../program/SearchInput.vue'
// @ts-ignore
import RightPanel from './RightPanel.vue'
// @ts-ignore
import InputField from '@/components/style/InputField.vue'
import { databaseClient } from '@/database/implementation'
import { computed, ref, toRaw } from 'vue'
import { SupabasePermissionHelper } from '@/database/supabase/supabase_permission_helper'
import { MessageStack, MessageType } from '../messages/message_stack'
import type { User } from '@/database/interface/user'

const users = ref<any[]>()
const selectedUser = ref<User | null>(null)
const selectedPermission = ref<number>(1)
const searchedText = ref<string>('')

function selectPermission(permId: number) {
  selectedPermission.value = permId
  console.log(`Selected permission ${permId}`)
}

function selectUser(userToSelect: any) {
  selectedUser.value = userToSelect
  console.log(
    userToSelect
      ? 'Selected user ' + userToSelect.username
      : 'No user selected',
  )
}

function getPermFromId(id: number) {
  if (!id) return 'Utilisateur'
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
        ? user.username.toLowerCase().includes(searchedText.value.toLowerCase())
        : true),
  )
})
</script>

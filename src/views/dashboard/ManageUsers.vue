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
          placeholder="leonhard-euler@maths.ch ..."
        />
      </div>
      <div class="flex flex-1 flex-col px-4 py-2 font-bold text-gray-800">
        <div
          class="my-1 flex w-full cursor-pointer items-center justify-between rounded-lg p-2 transition-all hover:bg-primary/95 child:hover:text-white"
          v-for="(user, index) in usersWithSelectedPerms"
          :key="index"
          @click="selectUser(user)"
        >
          <span @click="copyEmail(index)" class="flex items-center">
            <span class="w-64">
              {{ maxLength(user.email, 25) }}
            </span>
            <button
              @click="copyEmail(index)"
              class="mx-4 hidden rounded-lg bg-gray-200 p-2 !text-gray-800 hover:!text-primary lg:block"
            >
              Copier
            </button>
          </span>
          <select
            :value="selectedPermission"
            @focus="(event) => (this.oldValue = event.target.value)"
            @change="
              (event) =>
                handleUpdateRole(
                  this,
                  user.id,
                  user.email,
                  event.target.value,
                  this.oldValue,
                )
            "
            class="rounded-lg p-2 !text-gray-800"
          >
            <option
              class="font-bold"
              v-for="(permission, index) in [0, 1, 2, 3, 4]"
              :key="index"
              :value="permission"
            >
              {{ getPermFromId(permission) }}
            </option>
          </select>
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
// @ts-ignore
import RightPanel from './RightPanel.vue'
// @ts-ignore
import InputField from '@/components/style/InputField.vue'
import { maxLength } from '@/utils/misc_utils'
import { databaseClient } from '@/database/implementation'
import { computed, ref, watch } from 'vue'
import { SupabasePermissionHelper } from '@/database/supabase/supabase_permission_helper'
import {
  MessageStack,
  MessageType,
  pushError,
  pushSuccess,
} from '../messages/message_stack'
import type { User } from '@/database/interface/user'
import { getElementsInArrayByKeyValue, uniqueArray } from '@/utils/misc_utils'

const users = ref<any[]>()
const selectedUser = ref<User | null>(null)
const selectedPermission = ref<number>(1)
const searchedText = ref<string>('')
const refetch = ref<boolean>(false)

function selectPermission(permId: number) {
  selectedPermission.value = permId
  console.log(`Selected permission ${permId}`)
}

function selectUser(userToSelect: any) {
  selectedUser.value = userToSelect
  console.log(
    userToSelect ? 'Selected user ' + userToSelect : 'No user selected',
  )
}

function getPermFromId(id: number) {
  if (!id) return 'Utilisateur'
  return SupabasePermissionHelper.permissionFromId(id)
}

function copyEmail(index: number) {
  navigator.clipboard
    .writeText(usersWithSelectedPerms.value[index].email)
    .then(() => pushSuccess('Email copié !'))
    .catch(() => pushError("Quelque chose s'est mal passé"))
}

async function handleUpdateRole(
  self: any,
  uuid: string,
  email: string,
  newRole: number,
  oldRole: number,
) {
  await databaseClient.addUserToRole(uuid, newRole, oldRole)
  pushSuccess(`L'utilisateur ${email} est passé de ${getPermFromId(oldRole)} à ${getPermFromId(newRole)}`)
  self.oldValue = newRole
  refetch.value = !refetch.value
}

async function fetchDb() {
  await databaseClient
    .getAllUsers()
    .then((fetchedUsers) => {
      users.value = fetchedUsers
    })
    .catch((error) => {
      console.error(error.message)
      MessageStack.getInstance().push({
        text: "Quelque chose s'est mal passé",
        type: MessageType.ERROR,
      })
    })
}

watch(refetch, fetchDb)
fetchDb()

const usersWithSelectedPerms = computed(() => {
  if (!users.value?.length) return []
  return uniqueArray(
    getElementsInArrayByKeyValue(
      users.value,
      'id',
      selectedPermission.value,
    )[0].users.filter(({ email }: { email: string }) =>
      email.includes(searchedText.value),
    ),
  )
})
</script>

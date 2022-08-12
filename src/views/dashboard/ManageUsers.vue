<template>
  <div class="flex">
    <DataColumn title="Utilisateurs">
      <div
        class="bold my-4 cursor-pointer p-2 text-gray-700"
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
    Hello World
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import DataColumn from './DataColumn.vue'
import { databaseClient } from '@/database/implementation'
import type { SupabaseUser } from '@/database/supabase/supabase_user'
import { ref, shallowRef } from 'vue'
import { SupabasePermissionHelper } from '@/database/supabase/supabase_permission_helper'
import { MessageStack, MessageType } from '../messages/message_stack'

const users = ref<SupabaseUser[]>()
const selectedUser = shallowRef<SupabaseUser>()
const selectedPermission = ref<number>()

function selectPermission(permId: number) {
  selectedPermission.value = permId
  console.log(`Selected permission ${permId}`)
}

function selectUser(userToSelect: SupabaseUser) {
  selectedUser.value = userToSelect
  console.log(`Selected user ${userToSelect}`)
}

function getPermFromId(id: number) {
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
</script>

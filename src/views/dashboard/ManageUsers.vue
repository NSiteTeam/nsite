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
    <div class="w-0 flex-1 md:w-full">
      <div class="flex flex-wrap items-center justify-between">
        <h1 class="p-2 text-2xl font-bold">Utilisateurs</h1>
        <SearchInput
          class="m-4 p-1"
          v-model="searchedText"
          placeholder="leonhard-euler@maths.ch ..."
        />
      </div>
      <div class="flex flex-1 flex-col px-4 py-2 font-bold text-gray-800">
        <div
          class="my-1 flex w-full cursor-pointer flex-wrap items-center justify-between rounded-lg p-2 transition-all hover:bg-primary/95 child:hover:text-white"
          v-for="(user, index) in usersWithSelectedPerms"
          :key="index"
        >
          <span @click="copyEmail(index)" class="flex items-center">
            <span class="w-64">
              {{ maxLength(user.email, 25) }}
            </span>
            <button
              @click="copyEmail(index)"
              class="mx-4 hidden rounded-lg bg-gray-200 p-2 !text-gray-800 hover:!text-primary xl:block"
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
          <div
            @click="() => toggleRightPannel(user)"
            v-if="selectedPermission > 0"
            class="m-2 rounded-lg bg-gray-200 p-2 !text-gray-800 hover:!text-primary"
          >
            Niveaux
          </div>
        </div>
      </div>
    </div>
    <RightPanel
      :isOpen="rightPannelOpened"
      @cancel="toggleRightPannel"
      :title="'Niveaux du professeur'"
      description="À chaque professeur est assigné une liste de niveaux où il peut gérer les contenus."
    >
      <div v-if="selectedUser" class="flex h-full flex-col">
        <Keyword :big="false" primary class="font-bold mb-2">{{ selectedUser.email }}</Keyword>
        <label
          v-for="level in [1, 2, 3, 4, 5, 6, 7]"
          :key="level"
          class="bold flex items-center text-lg text-gray-800"
        >
          <input
            @click="(event) => handleCheck(level, event.target.checked, selectedUser.email)"
            type="checkbox"
            class="m-1"
            :checked="selectedUser.levels.includes(level)"
          />
          {{ SupabaseLevelHelper.getLevelById(level).fullName }}
        </label>
        <div
          class="absolute bottom-0 left-0 flex w-full items-center justify-between place-self-end p-4"
        >
          <ActionButton cancel @click="toggleRightPannel">Annuler</ActionButton>
        </div>
      </div>
      <div
        v-else
        class="flex w-full justify-center text-xl font-bold text-gray-800"
      >
        Chargement ...
      </div>
    </RightPanel>
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
// @ts-ignore
import Keyword from '@/components/style/Keyword.vue'
// @ts-ignore
import ActionButton from '../../components/style/ActionButton.vue'
import { SupabaseLevelHelper } from '@/database/supabase/supabase_level_helper'
import { maxLength } from '@/utils/misc_utils'
import { databaseClient } from '@/database/implementation'
import { SupabasePermissionHelper } from '@/database/supabase/supabase_permission_helper'
import { getElementsInArrayByKeyValue, uniqueArray } from '@/utils/misc_utils'
import { computed, ref, watch } from 'vue'
import type { User } from '@/database/interface/user'
import {
  MessageStack,
  MessageType,
  pushError,
  pushSuccess,
} from '../messages/message_stack'

const users = ref<any[]>()
const selectedUser = ref<any>(null)
const selectedPermission = ref<number>(0)
const searchedText = ref<string>('')
const rightPannelOpened = ref<boolean>(false)

function toggleRightPannel(user: any) {
  fetchDb()
    .then(() => selectUser(user))
    .catch((e) => console.error(e))

  rightPannelOpened.value = !rightPannelOpened.value
}

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

async function handleCheck(level: number, newValue: boolean, email: string) {
  try {
    if (newValue) {
      await databaseClient.checkLevelForUser(selectedUser.value!!.id, level)
      selectedUser.value.levels.push(level)
    } else {
      await databaseClient.uncheckLevelForUser(selectedUser.value!!.id, level)
      selectedUser.value.levels = selectedUser.value.levels.filter(
        (userLevel: number) => userLevel != level,
      )
    }
    pushSuccess(
      `Le professeur ${email} s'est vu ${newValue ? 'assigné' : 'retiré'} le niveau ${
        SupabaseLevelHelper.getLevelById(level).abbreviated
      }`,
    )
  } catch (e) {
    pushError(e as string)
    console.error(e as string)
  }
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
  pushSuccess(
    `L'utilisateur ${email} est passé de ${getPermFromId(
      oldRole,
    ) ?? 'utilisateur'} à ${getPermFromId(newRole) ?? 'utilisateur'}`,
  )
  self.oldValue = newRole
  fetchDb()
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

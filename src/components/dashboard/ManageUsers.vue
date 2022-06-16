<script setup lang="ts">
// @ts-ignore
import { SupabasePermissionHelper } from '@/database/supabase/supabase_permission_helper'
import { Permission } from '@/database/interface/permissions'
import { databaseClient } from '@/database/implementation'
import type { User } from '@/database/interface/user'
import type { Ref } from 'vue'
import { computed, ref } from 'vue'

enum sortTypes {
  USERNAME,
  UUID,
  HIGHEST_ROLE,
}

enum orders {
  DESCENDING = -1,
  ASCENDING = 1,
}

enum sortIcons {
  DESCENDING = 'expand_more',
  ASCENDING = 'expand_less',
}

const users: Ref<any[]> = ref([])
const amount: Ref<number> = ref(5)
const increment = 5
const sortOrder: Ref<orders> = ref(orders.DESCENDING)
const selectedUser: Ref<User | undefined> = ref()
const selectedSortType: Ref<sortTypes> = ref(sortTypes.HIGHEST_ROLE)

await databaseClient
  .getAllUsers()
  .then((res) => {
    users.value = res
  })
  .catch((err) => {
    console.warn(err)
  })

const sortedData = computed(() => {
  switch (selectedSortType.value) {
    case sortTypes.HIGHEST_ROLE:
      return users.value.sort((a, b) => {
        return sortOrder.value * (getMaxPermition(b) - getMaxPermition(a))
      }).slice(0, amount.value)
    case sortTypes.UUID:
      return users.value.sort((a, b) => {
        return sortOrder.value * b.user.localeCompare(a.user)
      }).slice(0, amount.value)
    case sortTypes.USERNAME:
      return users.value.sort((a, b) => {
        return sortOrder.value * b.username.localeCompare(a.username)
      }).slice(0, amount.value)
    default:
      throw `Unknown permission : ${selectedSortType.value}`
  }
})

function reverseSort() {
  sortOrder.value *= -1
}

function getMaxPermition(user: any) {
  if (user.roles) {
    return Math.max(...user.roles?.map((role: any) => Number(role)))
  } else {
    return -1
  }
}

function changeSortType(newSortType: sortTypes) {
  if (selectedSortType.value == newSortType) {
    reverseSort()
  } else {
    selectedSortType.value = newSortType
  }
}

function getCorrespondingIcon(sortType: sortTypes) {
  if (
    orders.ASCENDING == sortOrder.value &&
    sortType == selectedSortType.value
  ) {
    return sortIcons.ASCENDING
  } else if (
    orders.DESCENDING == sortOrder.value &&
    sortType == selectedSortType.value
  ) {
    return sortIcons.DESCENDING
  } else {
    return ''
  }
}

function handleGetMore() {
  amount.value += increment
  console.log(amount.value)
}

function getPermissionFromId(permissionId: number): string {
  return SupabasePermissionHelper.permissionFromId(permissionId)
}
</script>

<template>
  <div class="manage-users">
    <div class="manage-users-table">
      <div class="header">
        <div
          class="cell title-cell"
          @click="changeSortType(sortTypes.USERNAME)"
        >
          <div class="cell-content">
            <div class="material-icons">
              {{ getCorrespondingIcon(sortTypes.USERNAME) }}
            </div>
            Nom d'utilisateur
          </div>
        </div>
        <div class="cell title-cell" @click="changeSortType(sortTypes.UUID)">
          <div class="cell-content">
            <div class="material-icons">
              {{ getCorrespondingIcon(sortTypes.UUID) }}
            </div>
            Identifiant unique
          </div>
        </div>
        <div
          class="cell title-cell"
          @click="changeSortType(sortTypes.HIGHEST_ROLE)"
        >
          <div class="cell-content">
            <div class="material-icons">
              {{ getCorrespondingIcon(sortTypes.HIGHEST_ROLE) }}
            </div>
            Rôle le plus haut
          </div>
        </div>
      </div>
      <div class="row" v-for="(user, index) in sortedData" :key="index">
        <div class="cell">
          {{ user.username }}
        </div>
        <div class="cell">
          {{ user.user }}
        </div>
        <div class="cell">
          {{ getPermissionFromId(getMaxPermition(user)) }}
        </div>
      </div>
      <div class="footer" @click="handleGetMore()">
        <div class="cell"></div>
        <div class="cell">Afficher plus</div>
        <div class="cell"></div>
      </div>
    </div>
  </div>
</template>

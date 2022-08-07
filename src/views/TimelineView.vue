<script setup lang="ts">
// @ts-ignore
import LargeTitle from '../components/style/LargeTitle.vue'
// @ts-ignore
import LoadingAnimation from '@/components/LoadingAnimation.vue'
// @ts-ignore
import Keyword from '@/components/style/Keyword.vue'
// @ts-ignore
import SmallTitle from '../components/style/SmallTitle.vue'
// @ts-ignore
import Searchbar from '../components/style/Searchbar.vue'
import { RouterLink } from 'vue-router'
import { databaseClient } from '@/database/implementation'
import type { HistoryPoint } from '@/database/interface/history_point'
import { computed, ref } from 'vue'
import type { Ref } from 'vue'

const historyPoints: Ref<Array<HistoryPoint>> = computed(() => {
  return databaseClient.fetchedHistoryPoints.value.filter(
    (e) => e.visible && e.title.includes(searchbarContent.value),
  )
})
databaseClient.fetchHistoryPoints()

const searchbarContent: Ref<string> = ref('')
</script>

<template>
  <div class="my-16 mx-8">
    <div class="my-4 flex items-center justify-between">
      <LargeTitle primary>Petite histoire des mathématiques :</LargeTitle>
      <Searchbar v-model="searchbarContent" />
    </div>
    <div v-if="!historyPoints.length" class="loading-container">
      <LoadingAnimation size="25%" />
    </div>
    <ul class="mx-8 flex list-none flex-wrap">
      <RouterLink
        :to="'/history-article/' + history.id"
        class="m-4 h-32 w-64 cursor-pointer overflow-hidden rounded-lg bg-primary p-4 text-white shadow-lg shadow-primary/70"
        v-for="(history, index) in historyPoints"
        :key="index"
      >
        <SmallTitle white>{{ history.title }}</SmallTitle>
      </RouterLink>
    </ul>
  </div>
</template>

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
import type { News } from '@/database/interface/news'
import { computed, ref } from 'vue'
import type { Ref } from 'vue'

const NewsPoints: Ref<Array<News>> = computed(() => {
  return databaseClient.fetchedNews.value.filter(
    (e) => e.visible && e.title.includes(searchbarContent.value),
  )
})
databaseClient.fetchNews(300, true)

const searchbarContent: Ref<string> = ref('')
</script>

<template>
  <div class="my-16 mx-8">
    <div class="my-4 flex items-center justify-between">
      <LargeTitle primary>Quelques nouvelles :</LargeTitle>
      <Searchbar v-model="searchbarContent" />
    </div>
    <div v-if="!NewsPoints.length" class="loading-container">
      <LoadingAnimation size="25%" />
    </div>
    <ul class="mx-8 flex list-none flex-wrap">
      <RouterLink
        :to="'/news-article/' + News.id"
        class="m-4 h-40 w-64 cursor-pointer overflow-hidden rounded-lg bg-primary p-4 text-white shadow-lg shadow-primary/70"
        v-for="(News, index) in NewsPoints"
        :key="index"
      >
        <SmallTitle white>{{ News.title }}</SmallTitle>
        <p>{{ News.subtitle }}</p>
        <em>{{ News.date.beautify() }}</em>
      </RouterLink>
    </ul>
  </div>
  <RouterLink :to="'/dashboard/actualites'" class="shouldBeSpheric shadow-lg shadow-primary/70" v-if='hasAccesToDashboard'>
    <svg style="color: white" xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-plus centered" viewBox="0 0 16 16"> <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" fill="white"></path> </svg>
  </RouterLink>
    
</template>
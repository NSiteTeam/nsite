<script setup lang="ts">
import { databaseClient } from "@/database/implementation";
import type { News } from "@/database/interface/news";
// @ts-ignore Vue bug
import NewsItem from '@/components/dashboard/edit/items/NewsItem.vue'
import type { Ref } from "vue";
import { ref } from "vue";

const newsPayload: Ref<News[] | null> = ref([])
console.log(databaseClient.fetchedNews.value.length == 0)
if (databaseClient.fetchedNews.value.length == 0) {
    await databaseClient.fetchNews(10)
}

newsPayload.value = databaseClient.fetchedNews.value
</script>

<template>
    <h3>Modifier les actualités</h3>
    <div class="news-editor">
        <div :news="news" v-for="(news, index) in databaseClient.fetchedNews" 
        :key="index" class="news-editor-item">{{news}}</div>
        <NewsItem :news="news" v-for="(news, index) in databaseClient.fetchedNews" 
        :key="index" class="news-editor-item" />
    </div>
</template>
<script setup lang="ts">
import { databaseClient } from "@/database/implementation";
import { ref } from "vue";
import type { Ref } from "vue";
import type { News } from "@/database/interface/news";

const newsPayload: Ref<News[]> = ref([])
const loading = ref(true)
await databaseClient.fetchNews(10)
loading.value = false
newsPayload.value = databaseClient.fetchedNews.value
</script>

<template>
    <h3>Modifier les actualités</h3>
    <div class="news-container">
        <div class="indication" v-if="loading">Chargement des nouvelles</div>
        <div v-for="(news, index) in newsPayload" :key="index" class="news">
            {{ news.title }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { databaseClient } from "@/database/implementation";
import type { News } from "@/database/interface/news";
// @ts-ignore Vue bug
import NewsItem from '@/components/dashboard/edit/items/NewsItem.vue'
import type { Ref } from "vue";
import { ref } from "vue";

const newsPayload: Ref<News[] | null> = ref([])
const toggleNewsAdd: Ref<boolean> = ref(false)
console.log(databaseClient.fetchedNews.value.length == 0)
if (databaseClient.fetchedNews.value.length == 0) {
    await databaseClient.fetchNews(10)
}

function toggleAdd() {
    toggleNewsAdd.value = !toggleNewsAdd.value
}

newsPayload.value = databaseClient.fetchedNews.value
</script>

<template>
    <h3>Modifier les actualités</h3>
    <div class="news-editor">
        <div class="news-editor-add">
            <span class="material-icons" @click="toggleAdd()">{{ toggleNewsAdd ? 'done' : 'add' }}</span>
            Ajouter une actualité
        </div>
        <NewsItem :news="news" v-for="(news, index) in databaseClient.fetchedNews.value" 
        :key="index" class="news-editor-item" />
    </div>
</template>
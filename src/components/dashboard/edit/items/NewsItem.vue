<script setup lang="ts">
import { databaseClient } from '@/database/implementation'
import type { Ref } from 'vue'
import { ref } from 'vue'

const { news } = defineProps(['news'])

const title: Ref<HTMLElement | null> = ref(null)
const content: Ref<HTMLElement | null> = ref(null)
const edit: Ref<boolean> = ref(false)

function handleEdit(cancel = false) {
    edit.value = !edit.value

    if (!(edit.value && cancel)) {
        databaseClient.editNews(news.id, news.title, news.subtitle)
    }
}
</script>

<template>
    <div class="news-editor-item">
        <span class="material-icons pen" @click="handleEdit()">
            {{ edit ? 'done' : 'edit' }}
        </span>
        <span class="material-icons pen" @click="handleEdit(true)">
            {{ edit ? 'close' : '' }}
        </span>
        <h4 v-if="!edit" class="news-editor-item-title">{{ news.title }}</h4>
        <p v-if="!edit" class="news-editor-item-content">{{ news.subtitle }}</p>
        <input v-if="edit" v-model="news.title" class="news-editor-item-title">
        <input v-if="edit" v-model="news.subtitle" class="news-editor-item-content">
    </div>
</template>


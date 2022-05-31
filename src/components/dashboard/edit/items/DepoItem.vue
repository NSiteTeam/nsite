<script setup lang="ts">
import { databaseClient } from '@/database/implementation'
// @ts-ignore
import FileItem from './FileItem.vue'
import type { Ref } from 'vue'
import { ref } from 'vue'

const { depo } = defineProps(['depo'])

const title: Ref<HTMLElement | null> = ref(null)
const content: Ref<HTMLElement | null> = ref(null)
const edit: Ref<boolean> = ref(false)
const error: Ref<string | null> = ref(null)
const success: Ref<string | null> = ref(null)
const expandFiles: Ref<boolean> = ref(false)

const levels = [
    "Tale",
    "1ere",
    "2nd",
    "3eme",
    "4eme",
    "5eme",
    "6eme",
]

function toggleExpand() {
    expandFiles.value = !expandFiles.value
}

function handleEdit(cancel = false) {
    edit.value = !edit.value

    if (!(edit.value && cancel)) {
        databaseClient.editDepo(depo.id, depo.title, depo.description, Number(depo.level))
        .then(res => success.value = res)
        .catch(res => error.value = res)
    }
}
</script>

<template>
    <div class="good" v-if="success && !error">
        {{ success }}
    </div>
    <div class="error" v-else-if="!success && error">
        {{ error }}
    </div>
    <div class="depo-editor-item">
        <span class="material-icons pen" @click="handleEdit()">
            {{ edit ? 'done' : 'edit' }}
        </span>
        <span class="material-icons pen" @click="handleEdit(true)">
            {{ edit ? 'close' : '' }}
        </span>
        <h4 v-if="!edit" class="depo-editor-item-title">{{ depo.title }}</h4>
        <p v-if="!edit" class="depo-editor-item-content">{{ depo.description }}</p>
        <p v-if="!edit" class="depo-editor-item-level">
            Niveau: {{ levels[depo.level] }}
        </p>
        <input v-if="edit" v-model="depo.title" class="depo-editor-item-title">
        <textarea v-if="edit" v-model="depo.description" class="depo-editor-item-content"></textarea>
        <select v-if="edit" v-model="depo.level" class="depo-editor-item-level">
            <option selected value="" disabled>-- Sélectionnez un niveau --</option>
            <option :value="index" v-for="(level, index) in levels" 
            :key="level" id="level" placeholder="Niveau">
                {{ level }}
            </option>
        </select>
        <span @click='toggleExpand()' class="material-symbols-outlined expand">
            expand_more
        </span>
        {{ expandFiles }}
    </div>
</template>


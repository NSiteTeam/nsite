<script setup lang="ts">
import { databaseClient } from '@/database/implementation'
// @ts-ignore
import FileItem from './FileItem.vue'
// @ts-ignore
import Upload from './../Upload.vue'
import { computed } from 'vue'
import type { Ref } from 'vue'
import { ref } from 'vue'

const { depo } = defineProps(['depo'])

const edit: Ref<boolean> = ref(false)
const error: Ref<string | null> = ref(null)
const expandFiles: Ref<boolean> = ref(false)
const success: Ref<string | null> = ref(null)
const title: Ref<HTMLElement | null> = ref(null)
const content: Ref<HTMLElement | null> = ref(null)
const fileInput: Ref<HTMLElement | null> = ref(null)
const submitted: Ref<boolean | string> = ref(false)
const toggleAddButton = ref(false)

const levels = [
    "Tale",
    "1ere",
    "2nd",
    "3eme",
    "4eme",
    "5eme",
    "6eme",
]

function handleUpload(event: any) {
    console.log(toggleAddButton.value)
    toggleAddButton.value = !toggleAddButton.value
}

function handleEdit(cancel = false) {
    edit.value = !edit.value

    if (!(edit.value && cancel)) {
        databaseClient.editDepo(depo.id, depo.title, depo.description, Number(depo.level))
        .then(res => success.value = res)
        .catch(res => error.value = res)
    }
}

async function performUpload() {
    if (fileInput.value) {
        // @ts-ignore Vue considère qu'un élément HTML n'a pas l'attribut files alors que si
        console.log(fileInput.value.files[0])
        await databaseClient.uploadFileToDeposit(
            // @ts-ignore Vue considère qu'un élément HTML n'a pas l'attribut files alors que si
            fileInput.value.files[0], depo.name, message.value
        )
        .then(message => {
            success.value = message
        }).catch(message => {
            console.warn(message)
            error.value = message
        })
    } else {
        error.value = "Pas de fichier selectionné :("
        success.value = null
    }
}

function toggleExpandFiles() {
    expandFiles.value = !expandFiles.value
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
        <div class="depo-editor-left">
            <span class="material-icons pen" @click="handleEdit()">
                {{ edit ? 'done' : 'edit' }}
            </span>
            <span class="material-icons pen" @click="handleEdit(true)">
                {{ edit ? 'close' : '' }}
            </span>
            <h4 v-if="!edit" class="depo-editor-item-title">
                {{ depo.title }}
            </h4>
        </div>
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
        <span @click='toggleExpandFiles()' class="material-icons expand">
            {{ expandFiles ? 'expand_less' : 'expand_more' }}
        </span>
    </div>
    <div class="files" v-if="expandFiles">
        <Upload :depoTitle="depo.title" />
        <FileItem v-for="(fileId, index) in depo.content" :key="index" :fileId="fileId" />
    </div>
</template>


<script setup lang="ts">
import { databaseClient } from "@/database/implementation"
import type { Ref } from "vue"
import { ref } from "vue"

const title: Ref<string> = ref("")
const content: Ref<string> = ref("")
const date: Ref<string> = ref("")

function handleSubmit() {
    databaseClient.postHistotyPoint(title.value, content.value, date.value)
}
</script>

<template>
    <div class="add-news">
        <h3>Ajouter un point d'histoire</h3>
        <label for="title">
            <h3>Titre</h3>
        </label>
        <input v-model="title" id="title" type="text" placeholder="Titre">
        <label for="content">
            <h3>Contenu</h3>
        </label>
        <textarea v-model="content" id="content" type="text" placeholder="Contenu">
        </textarea>
        <label for="date">
            <h3>Date</h3>
        </label>
        <input v-model="date" id="date" type="text" placeholder="Date">
        <button class="submit" @click="handleSubmit()">Envoyer</button>
    </div>
</template>
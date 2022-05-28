<script setup lang="ts">
import { databaseClient } from "@/database/implementation"
import type { Ref } from "vue"
import { ref } from "vue"

const title: Ref<string> = ref("")
const content: Ref<string> = ref("")
const date: Ref<string> = ref("")
const submitted: Ref<boolean> = ref(false)

function handleSubmit() {
    databaseClient.postHistotyPoint(title.value, content.value, date.value)
    .then(_ => submitted.value = true)
}
</script>

<template>
    <div class="submitted" v-if="submitted">
        Le point d'histoire à été ajouté à la base de données
    </div>
    <div class="add-news" v-else>
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
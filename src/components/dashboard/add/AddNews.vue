<script setup lang="ts">
import { databaseClient } from "@/database/implementation"
import type { Ref } from "vue"
import { ref } from "vue"

const title: Ref<string> = ref("")
const content: Ref<string> = ref("")
const submitted: Ref<boolean> = ref(false)
databaseClient.fetchNews(10)

function handleSubmit() {
    databaseClient.postNews(title.value, content.value)
    .then(_ => submitted.value = true)
}
</script>

<template>
    <div v-if="submitted">
        Le point d'actualité à bien été ajouté
    </div>
    <div class="add-news" v-else>
        <h3>Ajouter une actualité</h3>
        <label for="title">
            <h3>Titre</h3>
        </label>
        <input v-model="title" id="title" type="text" placeholder="Titre">
        <label for="content">
            <h3>Contenu</h3>
        </label>
        <textarea v-model="content" id="content" type="text" placeholder="Contenu">
        </textarea>
        <button class="submit" @click="handleSubmit()">Envoyer</button>
    </div>
</template>
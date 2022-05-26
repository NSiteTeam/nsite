<script setup lang="ts">
import type { Ref } from "vue"
import { ref } from "vue"

const title: Ref<string> = ref("")
const content: Ref<string> = ref("")
</script>

<template>
    <div class="add-news">
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
        <button class="submit">Envoyer</button>
    </div>
</template>
<script setup lang="ts">
import type { Ref } from "vue";
import { ref } from "vue";

const title: Ref<string> = ref("")
const level: Ref<string> = ref("")
const description: Ref<string> = ref("")
const image: Ref<string> = ref("")
</script>

<template>
    <div class="add-depo">
        <h3>Ajouter un dépot de cours</h3>
        <label for="title"><h3>Titre</h3></label>
        <input class="add-depo-input" id="title" placeholder="Titre" v-model="title" />
        <label for="level"><h3>Niveau</h3></label>
        <input class="add-depo-input" id="level" placeholder="Niveau" v-model="level" />
        <label for="description"><h3>Description</h3></label>
        <input class="add-depo-input" id="description" placeholder="Description" v-model="description" />
        <label for="image"><h3>Image</h3></label>
        <input class="add-depo-input" id="image" placeholder="Image" v-model="image" />
    </div>
</template>
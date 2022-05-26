<script setup lang="ts">
import { databaseClient } from "@/database/implementation"
import type { Ref } from "vue";
import { ref } from "vue";

const levels = [
    "Tale",
    "1ere",
    "2nd",
    "3eme",
    "4eme",
    "5eme",
    "6eme",
]

const title: Ref<string> = ref("")
const level: Ref<string> = ref("")
const description: Ref<string> = ref("")

function handleSubmit() {
    databaseClient.postDeposit(
        title.value,
        level.value, 
        description.value
    )
}
</script>

<template>
    <div class="add-depo">
        <h3>Ajouter un dépôt de cours</h3>
        <label for="title"><h3>Titre</h3></label>
        <input class="add-depo-input" id="title" placeholder="Titre" v-model="title" />
        <label for="level"><h3>Niveau</h3></label>
        <select v-model="level">
            <option selected value="" disabled>-- Sélectionnez un niveau --</option>
            <option :value="index" v-for="(level, index) in levels" :key="level" 
            class="add-depo-input" id="level" placeholder="Niveau">
                {{ level }}
            </option>
        </select>
        <label for="description"><h3>Description</h3></label>
        <textarea style="height: 100px;" class="add-depo-input" 
        id="description" placeholder="Description" v-model="description" />
        <div class="submit" @click="handleSubmit()">Créer le dépôt</div>
    </div>
</template>
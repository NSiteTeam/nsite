<script setup lang="ts">
import { databaseClient } from "@/database/implementation"
import type { Ref } from "vue"
import { ref } from "vue"

const title: Ref<string> = ref("")
const content: Ref<string> = ref("")
const date: Ref<string> = ref("")
// const submitted: Ref<boolean> = ref(false)

// function handleSubmit() {
//     databaseClient.postHistotyPoint(title.value, content.value, date.value)
//     .then(_ => submitted.value = true)
// }
</script>

<template>
    <div class="add-news">
        <label for="title">
            <h3>Blacklist des élèves</h3>
        </label>
        <div class="blacklist-users">
            <!-- v-for avec les utilisateurs, mais demander de l'aide pour la base de donnée (avoir accès à l'ensemble des users) -->
        </div>
    </div>
</template>
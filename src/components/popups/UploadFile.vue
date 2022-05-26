<script setup lang="ts">
import { databaseClient } from "@/database/implementation"
import type { Repository } from "@/database/interface/repositories"
import { computed } from "vue"
import type { Ref } from "vue"
import { ref } from "vue"

const data: Ref<Repository[]> = ref([])
const fileName: Ref<string> = ref("")
const selected: Ref<string> = ref("")
const submitted: Ref<boolean> = ref(false)
databaseClient.getRepos().then(res => {
    data.value = res
})

function handleFileSelection(event: any) {
    fileName.value = event.data
}

function handleSubmit() {
    submitted.value = true
}

const output = computed(
    () => {
        return data.value.map(depo => {
            return depo.title
        })
    }
)
</script>


<template>
    <div class="file-upload">
        <div class="submitted" v-if="submitted">
            Votre fichier a bien été envoyé
        </div>
        <div v-else>
            <h3>Choisissez votre dépot pour y téléverser du contenu</h3>
            <div class="custom-select">
                <select v-model="selected">
                    <option disabled value="" class="highlight white">
                        -- Sélectionnez un dépot --
                    </option>
                    <option :value="depo" class="highlight white" v-for="(depo, index) in output" :key="index">
                        {{ depo }}
                    </option>
                </select>
            </div>
            <div class="chose-file" v-if="selected">
                <h3>Choisissez votre fichier</h3>
                <input type="file" class="highlight">
                <button class="submit" @click="handleSubmit()">Envoyer</button>
            </div>
        </div>
    </div>
</template>

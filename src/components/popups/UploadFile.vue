<script setup lang="ts">
import { databaseClient } from "@/database/implementation"
import type { Repository } from "@/database/interface/repositories"
import { computed } from "vue"
import type { Ref } from "vue"
import { ref } from "vue"

const data: Ref<Repository[]> = ref([])
const fileName: Ref<string> = ref("")
const selectedDepo: Ref<string> = ref("")
const fileInput: Ref<HTMLElement | null> = ref(null)
const message: Ref<string> = ref("")
const submitted: Ref<boolean | string> = ref(false)
const error: Ref<boolean | string> = ref(false)
databaseClient.getRepos().then(res => {
    data.value = res
})

function handleFileSelection(event: any) {
    fileName.value = event.data
}

async function handleSubmit() {
    console.log(fileInput.value)
    if (fileInput.value) {
        // @ts-ignore Vue considère qu'un élément HTML n'a pas l'attribut files alors que si
        console.log(fileInput.value.files[0])
        await databaseClient.uploadFileToDeposit(
            // @ts-ignore Vue considère qu'un élément HTML n'a pas l'attribut files alors que si
            fileInput.value.files[0], selectedDepo.value, message.value
        )
        .then(message => {
            submitted.value = message
        }).catch(message => {
            console.warn(message)
            error.value = message
        })
    } else {
        error.value = "Pas de fichier selectionné :("
        submitted.value = false
    }
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
        <div class="good" v-if="submitted && !error">
            {{ submitted }}
        </div>
        <div class="error" v-else-if="error && !submitted">
            {{ error }}
        </div>
        <div>
            <h3>Choisissez votre dépot pour y téléverser du contenu</h3>
            <div class="custom-select">
                <select v-model="selectedDepo">
                    <option disabled value="" class="highlight white">
                        -- Sélectionnez un dépot --
                    </option>
                    <option :value="depo" class="highlight white" v-for="(depo, index) in output" :key="index">
                        {{ depo }}
                    </option>
                </select>
            </div>
            <div class="chose-file" v-if="selectedDepo">
                <h3>Choisissez votre fichier</h3>
                <input type="file" class="highlight" ref="fileInput">
                <input type="text" placeholder="Ajoutez un message pour décrire votre fichier" v-model="message" />
                <button class="submit" @click="handleSubmit()">Envoyer</button>
            </div>
        </div>
    </div>
</template>

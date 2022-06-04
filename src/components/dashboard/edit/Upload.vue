<script setup lang="ts">
    import { databaseClient } from "@/database/implementation";
    import type { Repository } from "@/database/interface/repositories";
    import type { Ref } from "vue";
    import { ref, computed } from "vue";

    const { depoTitle } = defineProps(['depoTitle'])

    const uploadFileElement: Ref<HTMLElement | null> = ref(null)
    const toggleUpload: Ref<boolean> = ref(false)
    const success: Ref<string | null> = ref(null)
    const error: Ref<string | null> = ref(null)
    const fileMessage: Ref<string> = ref("")

    function toggleUploadMenu() {
        toggleUpload.value = !toggleUpload.value
    }

    async function upload() {
        if (uploadFileElement.value) {
            await databaseClient.uploadFileToDeposit(
                // @ts-ignore
                uploadFileElement.value.files[0], depoTitle, fileMessage.value
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
        setTimeout(() => [success.value, error.value] = [null, null], 3000)
    }
</script>

<template>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else-if="success" class="good">{{ success }}</div>
    <div class="upload">
        <div class="upload-toggler" :class="toggleUpload ? 'toggled' : ''"
        @click="toggleUploadMenu()">
            <span class="material-icons">
                {{ toggleUpload ? 'close' : 'add' }}
            </span>
            {{ toggleUpload ? 'Annuler le téléversement' : 'Ajouter un fichier' }}
        </div>
        <form class="upload-form" v-if="toggleUpload">
            <label for="file-input">Sélectionnez le fichier
                <input id="file-input" type="file" ref="uploadFileElement" />
            </label>
            <label for="file-name">Ajoutez un message à vos élèves
                <input v-model="fileMessage" type="text" name="fileMessage" id="file-message"
                placeholder="ex: Corrigé de la fiche d'exercice n°3" />
            </label>
        </form>
        <div v-if="toggleUpload" class="upload-validate" @click="upload()">
            <span class="material-icons">
                done
            </span>
            {{ toggleUpload ? 'Valider le téléversement' : 'Ajouter un fichier' }}
        </div>
    </div>
</template>
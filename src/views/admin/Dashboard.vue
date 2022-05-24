<script lang="ts" setup>
import { computed, ref } from "vue"

import { databaseClient } from "@/database/implementation"
import type { Ref } from "vue"
import type { Repository } from "@/database/interface/repositories"
import Card from "../../components/Card.vue"

const data: Ref<Array<Repository>> = ref([])

await databaseClient.getRepos().then(res =>
    data.value = res
)

const output = computed(
    () => {
        return data.value.filter()
    }
)

// affichage documents
const addDocuments = ref(false)
function showToAddDocuments() {
    if (addDocuments.value == false) {
        addDocuments.value = true
    }
    else {
        addDocuments.value = false
    }
}
</script>

<template>
    <div id="dashboard-container" class="shadow2">
        <button @click="showToAddDocuments()" class="add-documents">
            <span v-if="addDocuments==false" class="material-symbols-outlined">file_upload</span>
            <span v-if="addDocuments" class="material-symbols-outlined">arrow_drop_up</span>
        </button>
        <p>Ajouter des documents au site</p>

    </div>

    <div v-if="addDocuments" id="dashboard-set" class="shadow2">
        Choisissez votre dépot :

        <div v-for="(depo, index) in output" :key="index" :exercise="depo" class="depo">
            {{ depo }}
        </div>

    </div>

</template>


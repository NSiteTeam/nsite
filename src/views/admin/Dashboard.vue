<script lang="ts" setup>
import { computed, ref } from "vue"

import { databaseClient } from "@/database/implementation"
import type { Ref } from "vue"
import type { Repository } from "@/database/interface/repositories"

const data: Ref<Array<Repository>> = ref([])

await databaseClient.getRepos().then(res =>
    data.value = res
)

const output = computed(
    () => {
        const titles = data.value.map(repo => {
            return repo.title
        })
        return titles
    }
)
</script>

<template>
    <div id="dashboard-container">
        <div class="dashboard-item">
            <div class="action-title">
                <span class="material-icons white">
                    file_upload
                </span>
                <h3>Ajouter des documents au site :</h3>
            </div>
            <h4>Choisissez votre dépot :</h4>
            <div v-for="(depo, index) in output" :key="index" :exercise="depo" class="depo highlight">
                {{ depo }}
            </div>
        </div>
    </div>

</template>


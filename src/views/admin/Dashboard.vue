<script lang="ts" setup>
import { computed, ref } from "vue"
// @ts-ignore Vue bug
import UploadFile from "@/components/popups/UploadFile.vue"
// @ts-ignore Vue bug
import AddDeposit from "@/components/popups/AddDeposit.vue"
import { databaseClient } from "@/database/implementation"
import type { Ref } from "vue"
import type { Repository } from "@/database/interface/repositories"

const data: Ref<Array<Repository>> = ref([])
const displayPopup: Ref<null | string> = ref(null)

await databaseClient.getRepos().then(res =>
    data.value = res
)

function togglePopup(popupName: string) {
    if (displayPopup.value) {
        displayPopup.value = null
        document.body.classList.add("overflow-hidden")
    } else {
        displayPopup.value = popupName
        document.body.classList.remove("overflow-hidden")
    }
}

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
    <div v-if="displayPopup" @click="togglePopup()" class="full-page">
    </div>
    <div id="dashboard-container">
        <div class="dashboard-item" @click="togglePopup('upload')">
            <div class="action-title">
                <span class="material-icons white">
                    file_upload
                </span>
                <h3>Ajouter des documents</h3>
            </div>
        </div>
        <div class="dashboard-item" @click="togglePopup('add')">
            <div class="action-title">
                <span class="material-icons white">
                    add
                </span>
                <h3>Ajouter des dépôts</h3>
            </div>
        </div>
        <div v-if="displayPopup" class="popup">
            <div class="close-container">
                <span class="material-icons" @click="togglePopup()">close</span>
            </div>
            <UploadFile v-if="displayPopup == 'upload'" />
            <AddDeposit v-if="displayPopup == 'add'" />
        </div>
    </div>

</template>


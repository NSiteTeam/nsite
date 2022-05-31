<script lang="ts" setup>
import { computed, ref } from "vue"
// @ts-ignore Vue bug
import UploadFile from "@/components/dashboard/add/UploadFile.vue"
// @ts-ignore Vue bug
import AddDeposit from "@/components/dashboard/add/AddDeposit.vue"
// @ts-ignore Vue bug
import AddNews from "@/components/dashboard/add/AddNews.vue"
// @ts-ignore Vue bug
import AccesBlacklist from "@/components/dashboard/add/AccesBlacklist.vue"
// @ts-ignore Vue bug
import AddHistoryPoint from "@/components/dashboard/add/AddHistoryPoint.vue"
// @ts-ignore Vue bug
import EditNews from "@/components/dashboard/edit/EditNews.vue"
// @ts-ignore Vue bug
import EditDeposit from "@/components/dashboard/edit/EditDeposit.vue"
import { databaseClient } from "@/database/implementation"
import type { Ref } from "vue"
import type { Repository } from "@/database/interface/repositories"
import { useRoute } from "vue-router"

const data: Ref<Array<Repository>> = ref([])
const displayPopup = computed(() => useRoute().params.popup)
const action = computed(() => useRoute().params.action)

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
    <RouterLink v-if="displayPopup" to="/dashboard" class="full-page">
    </RouterLink>
    <div id="dashboard-container">
        <RouterLink class="dashboard-item" to="/dashboard/uploadFile/add">
            <div class="action-title">
                <span class="material-icons white">
                    file_upload
                </span>
                <h3>Ajouter des documents</h3>
            </div>
        </RouterLink>
        <RouterLink class="dashboard-item" to="/dashboard/addDeposit/add">
            <div class="action-title">
                <span class="material-icons white">
                    add
                </span>
                <h3>Ajouter des dépôts</h3>
            </div>
        </RouterLink>
        <RouterLink class="dashboard-item" to="/dashboard/addNews/add">
            <div class="action-title">
                <span class="material-icons white">
                    newspaper
                </span>
                <h3>Ajouter une actualité</h3>
            </div>
        </RouterLink>
        <RouterLink class="dashboard-item" to="/dashboard/addHistoryPoint/add">
            <div class="action-title">
                <span class="material-icons white">
                    functions
                </span>
                <h3>Ajouter un point d'histoire</h3>
            </div>
        </RouterLink>
        <RouterLink class="dashboard-item" to="/dashboard/blacklist">
            <div class="action-title">
                <span class="material-icons white">
                    receipt_long
                </span>
                <h3>Accéder à la blacklist des utilisateurs</h3>
            </div>
        </RouterLink>
        <div v-if="displayPopup" class="popup">
            <div class="close-container">
                <RouterLink class="material-icons" to="/dashboard">close</RouterLink>
            </div>
            <div class="action-bar" v-if="displayPopup != 'blacklist'">
                <RouterLink class="action-bar-item" :to="'/dashboard/' + displayPopup + '/add'">Ajouter</RouterLink>
                <RouterLink class="action-bar-item" :to="'/dashboard/' + displayPopup + '/edit'">Modifier</RouterLink>
            </div>
            <!-- Manage files components -->
            <UploadFile v-if="displayPopup == 'uploadFile' && action == 'add'" />
            <!-- Manage deposits components -->
            <AddDeposit v-if="displayPopup == 'addDeposit' && action == 'add'" />
            <EditDeposit v-if="displayPopup == 'addDeposit' && action == 'edit'" />
            <!-- Manage news components -->
            <AddNews v-if="displayPopup == 'addNews' && action == 'add'" />
            <EditNews v-if="displayPopup == 'addNews' && action == 'edit'" />
            <!-- Manage history points components -->
            <AddHistoryPoint v-if="displayPopup == 'addHistoryPoint' && action == 'add'" />
            <!-- Manage muted users -->
            <AccesBlacklist v-if="displayPopup == 'blacklist'" />
        </div>
    </div>
</template>


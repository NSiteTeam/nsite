<script setup lang="ts">
    import { databaseClient } from "@/database/implementation";
    import type { Repository } from "@/database/interface/repositories";
    import FileItem from "@/components/dashboard/edit/items/FileItem.vue"
    import { watch, ref, toRaw, onMounted } from "vue";
    import type { Ref } from "vue";
    import { Level } from '@/database/interface/level'

    const newDepoLevel: Ref<number | null> = ref(null)
    const displaySidePannel: Ref<boolean> = ref(false)
    const newDepoDescription: Ref<string> = ref("")
    const newDepoTitle: Ref<string> = ref("")
    const depositTableIsExpanded = ref(true)
    const success: Ref<boolean> = ref(false)
    const error: Ref<string | null> = ref(null)
    const loading: Ref<boolean> = ref(false)
    const files: Ref<any[]> = ref([])
    const selectedDeposit = ref()
    const deposits = ref()

    const levels = Level.LEVELS

    await databaseClient.getOwnedDeposits().then(result => {
        deposits.value = result
        selectedDeposit.value = result[0]
    })

    async function fetchDepos() {
        deposits.value = []
        await databaseClient.getOwnedDeposits().then(result => {
            deposits.value = result
            selectedDeposit.value = result[0]
        })
    }

    function toggleSidePannel() {
        displaySidePannel.value = !displaySidePannel.value
    }

    function fetchFiles() {
        files.value = []
        selectedDeposit.value.content?.map(async (fileId: number) => {
            const file = ref()
            await databaseClient.getFile(fileId)
            .then(res => file.value = res)
            files.value.push(toRaw(file.value))
        })
    }

    function flipDepositListExpansion() {
        depositTableIsExpanded.value = !depositTableIsExpanded.value
    }

    function selectDeposit(deposit: Repository) {
        selectedDeposit.value = deposit
    }

    async function addDeposit() {
        if (newDepoTitle.value != "" && newDepoLevel.value != null) {
            loading.value = true
            await databaseClient.postDeposit(
                newDepoTitle.value,
                newDepoLevel.value,
                newDepoDescription.value
            ).then(_ => success.value = true)
            .catch(message => error.value = message)
            loading.value = false
        } else {
            error.value = "Veuillez remplir tout les champs requis"
        }
        setTimeout(_ => [success.value, loading.value, error.value] = [false, false, null], 3000)
    }

    onMounted(fetchFiles)
    watch(selectedDeposit, fetchFiles)
    watch(success, fetchFiles)
    watch(success, fetchDepos)
</script>

<template>
    <div class="good" v-if="success">Le dépôt a bien été créé</div>
    <div class="indication" v-else-if="loading">Création en cours ...</div>
    <div class="error" v-else-if="error">{{ error }}</div>
    <div id="manage-deposit">
        <div id="deposit-list" :class="{ 'hidden': !depositTableIsExpanded }">
            <h3 id="deposit-list-title">Vos depôts de ressources</h3>
            <span
                v-on:click='flipDepositListExpansion()'
                id="deposit-list-menu-icon"
                class="material-icons white"
                :class="{ 'horizontal-symmetry': depositTableIsExpanded }"
            >
                arrow_forward_ios
            </span>
            <ul id='deposit-names'>
                <li
                    class='deposit-list-element'
                    v-for="deposit in deposits"
                    :key="deposit"
                    :class="{ 'selected': deposit == selectedDeposit }"
                    v-on:click='selectDeposit(deposit)'
                >
                    {{ deposit.title }}
                </li>
                <li @click="toggleSidePannel()" class='deposit-list-element' id="add-deposit-button">
                    <span class="material-icons white">
                        add
                    </span>
                    <span>
                        Créer un nouveau dépôt
                    </span>
                </li>
            </ul>
        </div>
    </div>
    <div class="files">
        <FileItem v-for="(file, index) in files" :key="index" :file="file" />
    </div>
    <div class="mask" v-if="displaySidePannel" @click="toggleSidePannel()"></div>
    <div class="side-pannel" v-if="displaySidePannel">
        <h4 class="side-pannel-title">
            <div class="material-icons side-pannel-title-cross" @click="toggleSidePannel()">close</div>
            Créez un nouveau dépot de ressources
        </h4>
        <div class="side-pannel-fields">
            <div class="side-pannel-field">
                <label class="side-pannel-field-label" for="depo-name">Nom du dépôt</label>
                <input v-model="newDepoTitle" class="side-pannel-field-input" type="text" name="depo-name" id="depo-name" />
            </div>
            <div class="side-pannel-field">
                <label class="side-pannel-field-label" for="depo-name">Description</label>
                <input v-model="newDepoDescription" class="side-pannel-field-input" placeholder="Optionnel"
                type="text" name="depo-name" id="depo-name" />
            </div>
            <div class="side-pannel-field">
                <label class="side-pannel-field-label" for="depo-name">Niveau</label>
                <select v-model="newDepoLevel" class="side-pannel-field-input">
                    <option selected value="" disabled>-- Sélectionnez un niveau --</option>
                    <option :value="index" v-for="(level, index) in levels"
                    :key="level.index" id="level" placeholder="Niveau">
                        {{ level.abbreviated }}
                    </option>
                </select>
            </div>
        </div>
        <div class="side-pannel-files">
            <div class="side-pannel-files-header">
                <h4 class="side-pannel-files-header-title">Ajoutez des Fichiers</h4>
                <h5 class="side-pannel-files-header-subtitle">Inaugurez votre dépôt en y ajoutant du contenu</h5>
            </div>
            <div class="side-pannel-files-menu">
                <i>Ceci est un texte générique à remplacer par le menu pour ajouter un fichier (en construction)</i>
            </div>
        </div>
        <div class="side-pannel-bottom-buttons">
            <button class="side-pannel-bottom-buttons-cancel" @click="toggleSidePannel()">Annuler</button>
            <button class="side-pannel-bottom-buttons-submit" @click="addDeposit()">Envoyer</button>
        </div>
    </div>
</template>
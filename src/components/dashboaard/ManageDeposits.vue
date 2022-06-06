<script setup lang="ts">
    import { databaseClient } from "@/database/implementation";
    import type { Repository } from "@/database/interface/repositories";
    import FileItem from "@/components/dashboard/edit/items/FileItem.vue"
    import { watch, ref, toRaw, onMounted, shallowRef } from "vue";
    import type { Ref } from "vue";
    import { Level } from '@/database/interface/level'
    import DataColumn from '@/components/dashboaard/DataColumn.vue'
    import { DataSection } from "@/utils/data_section";

    const newDepositLevel: Ref<number | null> = ref(null)
    const displaySidePannel: Ref<boolean> = ref(false)
    const newDepositDescription: Ref<string> = ref("")
    const newDepositTitle: Ref<string> = ref("")
    const success: Ref<boolean> = ref(false)
    const error: Ref<string | null> = ref(null)
    const loading: Ref<boolean> = ref(false)
    const files: Ref<any[]> = ref([])
    const selectedDeposit: Ref<Repository | null> = ref(null)
    const deposits: Ref<DataSection<Repository>[]> = shallowRef([])

    const levels = Level.LEVELS


    // Fetch deposits and sort them into sections
    async function fetchDeposits() {
        deposits.value = DataSection.makeSections(await databaseClient.getOwnedDeposits(), (e) => e.level.abbreviated)
    }

    await fetchDeposits().then(() => {
        if (deposits.value.length > 0) {
            selectedDeposit.value = deposits.value[0].values[0]
        }
    })

    function depositToText(deposit: Repository) {
        return deposit.title
    }

    function depositToKey(deposit: Repository) {
        return deposit.id
    }

    function toggleSidePannel() {
        displaySidePannel.value = !displaySidePannel.value
    }

    function selectData(data: Repository) {
        selectedDeposit.value = data
    }

    function fetchFiles() {
        files.value = []
        selectedDeposit.value?.content?.map(async (fileId: number) => {
            const file = ref()
            await databaseClient.getFile(fileId)
            .then(res => file.value = res)
            files.value.push(toRaw(file.value))
        })
    }

    async function addDeposit() {
        if (newDepositTitle.value != "" && newDepositLevel.value != null) {
            loading.value = true

            await databaseClient.postDeposit(
                newDepositTitle.value,
                Level.levelFromIndex(newDepositLevel.value)!,
                newDepositDescription.value
            ).then(() => {
                success.value = true
            }).catch(message => {
                error.value = message
            })

            loading.value = false
        } else {
            error.value = "Veuillez remplir tout les champs requis"
        }
        setTimeout(() => [success.value, loading.value, error.value] = [false, false, null], 3000)
    }

    onMounted(fetchFiles)
    watch(selectedDeposit, fetchFiles)
    watch(success, fetchFiles)
    watch(success, fetchDeposits)
</script>

<template>
    <div class="good" v-if="success">Le dépôt a bien été créé</div>
    <div class="indication" v-else-if="loading">Création en cours ...</div>
    <div class="error" v-else-if="error">{{ error }}</div>

    <DataColumn
        @createData='toggleSidePannel'
        @selectData='selectData'
        title='Vos depôts de ressources'
        add-button-message='Créer un dépôt de ressources'
        :list='deposits'
        :to-text='depositToText'
        :to-key='depositToKey'
    />

    <div class="files">
        <FileItem v-for="(file, index) in files" :key="index" :file="file" />
    </div>
    <div class="mask" v-if="displaySidePannel" @click="toggleSidePannel()"></div>
    <div class="side-pannel" v-if="displaySidePannel">
        <h4 class="side-pannel-title">
            <div class="material-icons side-pannel-title-cross" @click="toggleSidePannel()">close</div>
            Créez un nouveau dépôt de ressources
        </h4>
        <div class="side-pannel-fields">
            <div class="side-pannel-field">
                <label class="side-pannel-field-label" for="deposit-name">Nom du dépôt</label>
                <input v-model="newDepositTitle" class="side-pannel-field-input" type="text" name="deposit-name" id="deposit-name" />
            </div>
            <div class="side-pannel-field">
                <label class="side-pannel-field-label" for="deposit-name">Description</label>
                <input v-model="newDepositDescription" class="side-pannel-field-input" placeholder="Optionnel"
                type="text" name="deposit-name" id="deposit-name" />
            </div>
            <div class="side-pannel-field">
                <label class="side-pannel-field-label" for="deposit-name">Niveau</label>
                <select v-model="newDepositLevel" class="side-pannel-field-input">
                    <option
                        :value="index"
                        v-for="(level, index) in levels"
                        :key="level.index"
                        id="level"
                        placeholder="Niveau"
                    >
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

<script setup lang="ts">
    // @ts-ignore
    import FileItem from "@/components/dashboard/edit/items/FileItem.vue"
    import { databaseClient } from "@/database/implementation";
    import type { Repository } from "@/database/interface/repositories";
    import { Level } from '@/database/interface/level'
    import { watch, ref, toRaw, onMounted, computed} from "vue";
    import type { Ref, ComputedRef  } from "vue";

    const displaySidePannelNewDepo: Ref<boolean> = ref(false)
    const displaySidePannelNewFile: Ref<boolean> = ref(false)
    const newDepoLevel: Ref<number | null> = ref(null)
    const newDepoDescription: Ref<string> = ref("")
    const error: Ref<string | null> = ref(null)
    const success: Ref<boolean> = ref(false)
    const loading: Ref<boolean> = ref(false)
    const errorFiles: Ref<string | null> = ref(null)
    const successFiles: Ref<boolean> = ref(false)
    const loadingFiles: Ref<boolean> = ref(false)
    const newDepoTitle: Ref<string> = ref("")
    const depositTableIsExpanded = ref(true)
    const files: Ref<any[]> = ref([])
    const rawFile: Ref<any> = ref()
    const newFile: Ref<string> = ref("")
    const newFileMessage = ref("")
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

    function toggleSidePannel(target: string) {
        if (target == 'depo') {
            displaySidePannelNewDepo.value = true
        } else if (target == 'file') {
            displaySidePannelNewFile.value = true
        } else {
            displaySidePannelNewDepo.value = false
            displaySidePannelNewFile.value = false
        }
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

    const uploadInfo: ComputedRef<string> = computed(() => {
      return files.value.length == 1
        ? files.value[0].name : ''
    })

    function watchFiles(e: any) {
        files.value = Array.from(e.target.files) || []
        rawFile.value = e.target.files[0] || []
        newFile.value = e.target.files[0].name
    }

    async function uploadFile() {
        loadingFiles.value = true
        await databaseClient.uploadFileToDeposit(
            rawFile.value, selectedDeposit.value.title, 
            newFileMessage.value, newFile.value
        ).then(_ => successFiles.value = true)
        .catch(res => errorFiles.value = res)
        loadingFiles.value = false
        setTimeout(_ => [successFiles.value, errorFiles.value] = [false, null], 3000)
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
    <div class="good" v-if="successFiles">Le fichier a bien été envoyé</div>
    <div class="indication" v-else-if="loadingFiles">Envoi en cours ...</div>
    <div class="error" v-else-if="errorFiles">{{ errorFiles }}</div>
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
                <li @click="toggleSidePannel('depo')" 
                class='deposit-list-element' id="add-deposit-button">
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
        <div class="files-actions">
            <button class="add files-action" @click="toggleSidePannel('file')">
                <span class="material-icons plus">add</span>
                <span class="label">Ajouter un fichier</span>
                
            </button>
            <button class="edit files-action">
                <span class="material-icons pen">edit</span>
                <span class="label">Modifier le dépôt</span>
            </button>
            <button class="delete files-action">
                <span class="material-icons bin">delete_forever</span>
                <span class="label">Supprimer le dépôt</span>
            </button>
        </div>
        <FileItem v-for="(file, index) in files" :key="index" :file="file" />
    </div>
    <div class="mask" v-if="displaySidePannelNewDepo || displaySidePannelNewFile" 
    @click="toggleSidePannel()"></div>
    <div class="side-pannel-new-depo" v-if="displaySidePannelNewDepo">
        <h4 class="side-pannel-new-depo-title">
            <div class="material-icons side-pannel-new-depo-title-cross" @click="toggleSidePannel()">
                close
            </div>
            Créez un nouveau dépot de ressources
        </h4>
        <div class="side-pannel-new-depo-fields">
            <div class="side-pannel-new-depo-field">
                <label class="side-pannel-new-depo-field-label" for="depo-name">Nom du dépôt</label>
                <input v-model="newDepoTitle" class="side-pannel-new-depo-field-input" 
                type="text" name="depo-name" id="depo-name" />
            </div>
            <div class="side-pannel-new-depo-field">
                <label class="side-pannel-new-depo-field-label" for="depo-name">Description</label>
                <input v-model="newDepoDescription" class="side-pannel-new-depo-field-input"
                type="text" name="depo-name" id="depo-name" ref="newFilemessage" placeholder="Optionnel" />
            </div>
            <div class="side-pannel-new-depo-field">
                <label class="side-pannel-new-depo-field-label" for="depo-name">Niveau</label>
                <select v-model="newDepoLevel" class="side-pannel-new-depo-field-input">
                    <option selected value="" disabled>-- Sélectionnez un niveau --</option>
                    <option :value="index" v-for="(level, index) in levels"
                    :key="level.index" id="level" placeholder="Niveau">
                        {{ level.abbreviated }}
                    </option>
                </select>
            </div>
        </div>
        <div class="side-pannel-new-depo-files">
            <div class="side-pannel-new-depo-files-header">
                <h4 class="side-pannel-new-depo-files-header-title">Ajoutez des Fichiers</h4>
                <h5 class="side-pannel-new-depo-files-header-subtitle">
                    Inaugurez votre dépôt en y ajoutant du contenu
                    </h5>
            </div>
            <div class="side-pannel-new-depo-files-menu">
                <i>
                    Ceci est un texte générique à remplacer 
                    par le menu pour ajouter un fichier (en construction)
                </i>
            </div>
        </div>
        <div class="side-pannel-new-depo-bottom-buttons">
            <button class="side-pannel-new-depo-bottom-buttons-cancel" @click="toggleSidePannel()">
                Annuler
            </button>
            <button class="side-pannel-new-depo-bottom-buttons-submit" @click="addDeposit()">
                Envoyer
            </button>
        </div>
    </div>
    <div class="side-pannel-new-file" v-if="displaySidePannelNewFile">
        <h4 class="side-pannel-new-file-title">
            <div class="material-icons side-pannel-new-file-title-cross" 
            @click="toggleSidePannel()">
                close
            </div>
            Ajoutez un nouveau fichier dans&nbsp;<u>{{ selectedDeposit.title }}</u>
            
        </h4>
        <div class="side-pannel-new-file-fields">
            <div>
                <div class="side-pannel-new-file-field-label">Votre fichier</div>
                <label class="side-pannel-new-file-field upload-file" for="file-input">
                    Ajouter un fichier
                    <input class="side-pannel-new-file-field-input-text" type="text" 
                    ref="newFileMessageElement" v-model="newFile" />
                    <input class="side-pannel-new-file-field-file-input" @change="watchFiles"
                    placeholder="Optionnel" type="file" name="depo-name" id="file-input" />
                </label>
            </div>
            <div class="side-pannel-new-file-field">
                <label class="side-pannel-new-file-field-label" for="depo-name">Description</label>
                <input v-model="newFileMessage" class="side-pannel-new-file-field-input" placeholder="Optionnel"
                type="text" name="depo-name" id="file-name" />
            </div>
        </div>
        <div class="side-pannel-new-file-bottom-buttons">
            <button class="side-pannel-new-file-bottom-buttons-cancel" @click="toggleSidePannel()">
                Annuler
            </button>
            <button class="side-pannel-new-file-bottom-buttons-submit" @click="uploadFile()">
                Envoyer
            </button>
        </div>
    </div>
</template>
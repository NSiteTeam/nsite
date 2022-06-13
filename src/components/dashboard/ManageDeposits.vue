<script setup lang="ts">
import FileItem from '@/components/dashboard/FileItem.vue'
import { databaseClient } from '@/database/implementation'
import type { Repository } from '@/database/interface/repositories'
import { Level } from '@/database/interface/level'
import { watch, ref, toRaw, onMounted, computed, shallowRef } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import DataColumn from '@/components/dashboard/DataColumn.vue'
import DangerPopup from '@/components/dashboard/popups/DangerPopup.vue'
import { DataSection } from '@/utils/data_section'

const displaySidePannelnewDeposit: Ref<boolean> = ref(false)
const displaySidePannelNewFile: Ref<boolean> = ref(false)
const displaySidePannelEditDepo: Ref<boolean> = ref(false)
const displayDeleteDepoPopup: Ref<boolean> = ref(false)
const newDepositLevel: Ref<number | null> = ref(null)
const newDepositDescription: Ref<string> = ref('')
const error: Ref<string | null> = ref(null)
const success: Ref<boolean> = ref(false)
const loading: Ref<boolean> = ref(false)
const errorDelete: Ref<string | null> = ref(null)
const successDelete: Ref<boolean> = ref(false)
const loadingDelete: Ref<boolean> = ref(false)
const errorFiles: Ref<string | null> = ref(null)
const successFiles: Ref<boolean> = ref(false)
const loadingFiles: Ref<boolean> = ref(false)
const newDepositTitle: Ref<string> = ref('')
const depositTableIsExpanded = ref(true)
const files: Ref<any[]> = ref([])
const rawFile: Ref<any> = ref()
const newFile: Ref<string> = ref('')
const newFileMessage = ref('')
const selectedDeposit: Ref<Repository | null> = ref(null)
const deposits: Ref<DataSection<Repository>[]> = ref([])
const ownersUsernames = computed((_) => {
  const usernames: Ref<string[]> = ref([])
  if (selectedDeposit.value)
    selectedDeposit.value.owners.map((owner) =>
      databaseClient
        .getUsername(owner)
        .then((res) => usernames.value.push(res))
        .catch((res) => (error.value = res)),
    )
  return usernames.value
})

const levels = Level.LEVELS

enum SidePannelTarget {
  DEPOSIT,
  FILE,
  EDIT,
  DELETE,
}

async function deleteCurrentDeposit() {
  loadingDelete.value = true
  if (selectedDeposit.value != null)
    await databaseClient
      .deleteDeposit(selectedDeposit.value.id)
      .then((_) => (successDelete.value = true))
      .catch((res) => (errorDelete.value = res))
  loadingDelete.value = false
  fetchDeposits()
  selectedDeposit.value = deposits.value[0].values[0]

  setTimeout(
    () => ([successDelete.value, errorDelete.value] = [false, null]),
    3000,
  )
}

// Fetch deposits and sort them into sections
async function fetchDeposits() {
  deposits.value = DataSection.makeSections(
    await databaseClient.getOwnedDeposits(),
    (e) => e.level.abbreviated,
  )
}

async function fetchDeposit(id: number) {
  if (deposits.value != null && selectedDeposit.value != null) {
    selectedDeposit.value = await databaseClient.getDeposit(
      selectedDeposit.value.id,
    )
    if (selectedDeposit.value != null) {
      const newData = await databaseClient.getDeposit(selectedDeposit.value.id)
      for (let i = 0; i < toRaw(deposits.value).length; i++) {
        for (let j = 0; j < deposits.value[i].values.length; j++) {
          if (deposits.value[i].values[j].id == selectedDeposit.value.id) {
            deposits.value[i].values[j] = selectedDeposit.value
          }
        }
      }
    }
  }
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

function toggleSidePannel(target?: SidePannelTarget) {
  if (target == SidePannelTarget.DEPOSIT) {
    displaySidePannelnewDeposit.value = true
  } else if (target == SidePannelTarget.FILE) {
    displaySidePannelNewFile.value = true
  } else if (target == SidePannelTarget.EDIT) {
    displaySidePannelEditDepo.value = true
  } else if (target == SidePannelTarget.DELETE) {
    displayDeleteDepoPopup.value = true
  } else {
    displaySidePannelnewDeposit.value = false
    displaySidePannelNewFile.value = false
    displaySidePannelEditDepo.value = false
    displayDeleteDepoPopup.value = false
  }
}

function selectData(data: Repository) {
  console.log(data)
  selectedDeposit.value = data
  fetchFiles()
}

function fetchFiles() {
  files.value = []
  selectedDeposit.value?.content?.map(async (fileId: number) => {
    const file = ref()
    await databaseClient.getFile(fileId).then((res) => (file.value = res))
    files.value.push(toRaw(file.value))
  })
}

async function addDeposit() {
  if (newDepositTitle.value != '' && newDepositLevel.value != null) {
    loading.value = true

    await databaseClient
      .postDeposit(
        newDepositTitle.value,
        Level.levelFromIndex(newDepositLevel.value)!,
        newDepositDescription.value,
      )
      .then(() => {
        success.value = true
      })
      .catch((message) => {
        error.value = message
      })

    loading.value = false
  } else {
    error.value = 'Veuillez remplir tout les champs requis'
  }
  setTimeout(
    () => ([success.value, loading.value, error.value] = [false, false, null]),
    3000,
  )
}

const uploadInfo: ComputedRef<string> = computed(() => {
  return rawFile.value.length == 1 ? files.value[0].name : ''
})

function watchFiles(e: any) {
  rawFile.value = e.target.files[0] || []
  newFile.value = e.target.files[0].name
}

function handleFileDelete() {
  if (selectedDeposit.value)
    fetchDeposit(selectedDeposit.value.id)
      .then((_) => fetchFiles())
      .catch((message) => console.error(message))
  toggleSidePannel()
}

async function uploadFile() {
  loadingFiles.value = true
  if (selectedDeposit.value != null)
    await databaseClient
      .uploadFileToDeposit(
        rawFile.value,
        selectedDeposit.value!.title,
        newFileMessage.value,
        newFile.value,
      )
      .then((_) => (successFiles.value = true))
      .catch((res) => (errorFiles.value = res))
  loadingFiles.value = false
  setTimeout(
    (_) => ([successFiles.value, errorFiles.value] = [false, null]),
    3000,
  )
}

onMounted(fetchFiles)
watch(success, fetchFiles)
watch(success, fetchDeposits)
watch(successFiles, async () => {
  // Prevents firering two times the API call
  if (selectedDeposit.value != null && successFiles.value)
    await fetchDeposit(selectedDeposit.value.id)
      .then((_) => fetchFiles())
      .catch((message) => console.error(message))
})
</script>

<template>
  <div class="good" v-if="success">Le dépôt a bien été créé</div>
  <div class="indication" v-else-if="loading">Création en cours ...</div>
  <div class="error" v-else-if="error">{{ error }}</div>
  <div class="good" v-if="successFiles">Le fichier a bien été envoyé</div>
  <div class="indication" v-else-if="loadingFiles">Envoi en cours ...</div>
  <div class="error" v-else-if="errorFiles">{{ errorFiles }}</div>
  <div class="good" v-if="successDelete">Le dépôt a bien été supprimé</div>
  <div class="indication" v-else-if="loadingDelete">
    Suppression en cours ...
  </div>
  <div class="error" v-else-if="errorDelete">{{ errorDelete }}</div>

  <DataColumn
    @createData="toggleSidePannel(SidePannelTarget.DEPOSIT)"
    @selectData="selectData"
    title="Vos depôts de ressources"
    add-button-message="Créer un dépôt de ressources"
    :list="deposits"
    :to-text="depositToText"
    :to-key="depositToKey"
  />

  <div class="files">
    <div class="files-actions">
      <button
        class="add files-action"
        @click="toggleSidePannel(SidePannelTarget.FILE)"
      >
        <span class="material-icons plus">add</span>
        <span class="label">Ajouter un fichier</span>
      </button>
      <button
        class="edit files-action"
        @click="toggleSidePannel(SidePannelTarget.EDIT)"
      >
        <span class="material-icons pen">edit</span>
        <span class="label">Modifier le dépôt</span>
      </button>
      <button
        class="delete files-action"
        @click="toggleSidePannel(SidePannelTarget.DELETE)"
      >
        <span class="material-icons bin">delete_forever</span>
        <span class="label">Supprimer le dépôt</span>
      </button>
    </div>
    <div class="files-details">
      <FileItem
        @deleted="handleFileDelete()"
        v-for="(file, index) in files"
        :key="index"
        :file="file"
      />
    </div>
  </div>
  <div
    class="mask"
    v-if="
      displaySidePannelnewDeposit ||
      displaySidePannelNewFile ||
      displaySidePannelEditDepo ||
      displayDeleteDepoPopup
    "
    @click="toggleSidePannel()"
  ></div>
  <div class="side-pannel-new-depo" v-if="displaySidePannelnewDeposit">
    <h4 class="side-pannel-new-depo-title">
      <div
        class="material-icons side-pannel-new-depo-title-cross"
        @click="toggleSidePannel()"
      >
        close
      </div>
      Créez un nouveau dépot de ressources
    </h4>
    <div class="side-pannel-new-depo-fields">
      <div class="side-pannel-new-depo-field">
        <label class="side-pannel-new-depo-field-label" for="depo-name"
          >Nom du dépôt</label
        >
        <input
          v-model="newDepositTitle"
          class="side-pannel-new-depo-field-input"
          type="text"
          name="depo-name"
          id="depo-name"
        />
      </div>
      <div class="side-pannel-new-depo-field">
        <label class="side-pannel-new-depo-field-label" for="depo-name"
          >Description</label
        >
        <input
          v-model="newDepositDescription"
          class="side-pannel-new-depo-field-input"
          type="text"
          name="depo-name"
          id="depo-name"
          ref="newFilemessage"
          placeholder="Optionnel"
        />
      </div>
      <div class="side-pannel-new-depo-field">
        <label class="side-pannel-new-depo-field-label" for="depo-name"
          >Niveau</label
        >
        <select
          v-model="newDepositLevel"
          class="side-pannel-new-depo-field-input"
        >
          <option selected value="" disabled>
            -- Sélectionnez un niveau --
          </option>
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
    <!-- <div class="side-pannel-new-depo-files">
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
        </div> -->
    <div class="side-pannel-new-depo-bottom-buttons">
      <button
        class="side-pannel-new-depo-bottom-buttons-cancel"
        @click="toggleSidePannel()"
      >
        Annuler
      </button>
      <button
        class="side-pannel-new-depo-bottom-buttons-submit"
        @click="addDeposit()"
      >
        Envoyer
      </button>
    </div>
  </div>
  <div class="side-pannel-new-file" v-if="displaySidePannelNewFile">
    <h4 class="side-pannel-new-file-title">
      <div
        class="material-icons side-pannel-new-file-title-cross"
        @click="toggleSidePannel()"
      >
        close
      </div>
      Ajoutez un nouveau fichier dans&nbsp;<u>{{ selectedDeposit.title }}</u>
    </h4>
    <div class="side-pannel-new-file-fields">
      <div>
        <div class="side-pannel-new-file-field-label">Votre fichier</div>
        <label class="side-pannel-new-file-field upload-file" for="file-input">
          Ajouter un fichier
          <input
            class="side-pannel-new-file-field-input-text"
            type="text"
            ref="newFileMessageElement"
            v-model="newFile"
          />
          <input
            class="side-pannel-new-file-field-file-input"
            @change="watchFiles"
            placeholder="Optionnel"
            type="file"
            name="depo-name"
            id="file-input"
          />
        </label>
      </div>
      <div class="side-pannel-new-file-field">
        <label class="side-pannel-new-file-field-label" for="depo-name"
          >Description</label
        >
        <input
          v-model="newFileMessage"
          class="side-pannel-new-file-field-input"
          placeholder="Optionnel"
          type="text"
          name="depo-name"
          id="file-name"
        />
      </div>
    </div>
    <div class="side-pannel-new-file-bottom-buttons">
      <button
        class="side-pannel-new-file-bottom-buttons-cancel"
        @click="toggleSidePannel()"
      >
        Annuler
      </button>
      <button
        class="side-pannel-new-file-bottom-buttons-submit"
        @click="uploadFile()"
      >
        Envoyer
      </button>
    </div>
  </div>
  <div class="side-pannel-edit-depo" v-if="displaySidePannelEditDepo">
    <h4 class="side-pannel-edit-depo-title">
      <div
        class="material-icons side-pannel-edit-depo-title-cross"
        @click="toggleSidePannel()"
      >
        close
      </div>
      Modifier le dépôt&nbsp;<u>{{ selectedDeposit.title }}</u>
    </h4>
    <div class="side-pannel-edit-depo-fields">
      <div class="side-pannel-edit-depo-field">
        <label class="side-pannel-edit-depo-field-label" for="depo-name"
          >Nom du dépôt</label
        >
        <input
          class="side-pannel-edit-depo-field-fieldinput-title"
          v-model="selectedDeposit.title"
        />
      </div>
      <div class="side-pannel-edit-depo-field">
        <label class="side-pannel-edit-depo-field-label" for="depo-name"
          >Auteurs</label
        >
        <div class="side-pannel-edit-depo-field-owners">
          {{ ownersUsernames.join(', ') }}
          <div class="material-icons" title="Partager">share</div>
        </div>
      </div>
      <div class="side-pannel-edit-depo-field">
        <label class="side-pannel-edit-depo-field-label" for="depo-name"
          >Description</label
        >
        <textarea
          class="side-pannel-edit-depo-field-input"
          placeholder="Pas de description"
          type="text"
          name="depo-name"
          id="file-name"
          v-model="selectedDeposit.description"
        ></textarea>
      </div>
    </div>
    <div class="side-pannel-edit-depo-bottom-buttons">
      <button
        class="side-pannel-edit-depo-bottom-buttons-cancel"
        @click="toggleSidePannel()"
      >
        Annuler
      </button>
      <button
        class="side-pannel-edit-depo-bottom-buttons-submit"
        @click="uploadFile()"
      >
        Envoyer
      </button>
    </div>
  </div>
  <DangerPopup
    :title="'Supprimer le dépôt ' + selectedDeposit.title"
    content="Attention, vous êtes sur le point de supprimer un dépôt de ressources définitivement.
        Assurez-vous d'avoir sauvegardé préalablement son contenu.
        Si vous voulez toutefois den récupérer le contenu d'un dépôt supprimé,
        il est possible que nous l'avons encore conservé."
    :messageToType="selectedDeposit.title"
    actionName="Supprimer définitivement le dépôt"
    @deletion="deleteCurrentDeposit()"
    @close="toggleSidePannel()"
    v-if="displayDeleteDepoPopup"
  />
</template>

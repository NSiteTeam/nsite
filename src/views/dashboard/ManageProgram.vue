<template>
  <div class="flex flex-row">
    <DataColumn
      class="shrink-0"
      title="Programme"
      @open="dataColumnOpened = true"
      @close="dataColumnOpened = false"
    >
      <template v-if="programLoaded">
        <template v-for="pair in editableLevelsPairs" :key="pair.level.id">
          <div class="h-min">
            <div class="flex justify-between text-gray-500 hover:text-gray-700">
              <SmallTitle class="flex-1 cursor-default transition-colors">
                {{ pair.level.fullName }}
              </SmallTitle>
              <ActionIcon
                icon="expand_more"
                class="transition-transform"
                :class="{ '-scale-y-100': !pair.expanded }"
                @click="togglePairExpansion(pair)"
              />
            </div>
            <div
              class="overflow-y-clip transition-all"
              :class="{
                hidden: !pair.expanded,
              }"
            >
              <template v-if="pair.themes.length > 0">
                <template v-for="theme in pair.themes" :key="theme.uuid">
                  <div
                    class="my-1 flex cursor-pointer rounded-lg p-2 font-semibold text-gray-500"
                    :class="{
                      'hover:bg-gray-100': theme != selectedTheme,
                      'bg-gray-200': theme == selectedTheme,
                    }"
                    @click="selectTheme(theme)"
                  >
                    <span class="flex-1">{{ theme.name }}</span>
                    <Icon
                      :icon="theme.visible ? 'visibility' : 'visibility_off'"
                      class="ml-2 text-gray-500"
                    />
                  </div>
                </template>
              </template>
              <template v-else>
                <div class="my-1 rounded-lg p-2">
                  <p class="whitespace-normal text-sm italic text-gray-500">
                    Il n'y a aucun thème dans ce niveau pour le moment.
                  </p>
                </div>
              </template>
            </div>
          </div>
        </template>

        <ActionButton
          primary
          v-if="teachingLevels.length"
          class="mt-8 w-full"
          @click="addNewTheme()"
        >
          <Icon icon="add" />
          {{
            atLeastOneTheme
              ? 'Ajouter un nouveau thème'
              : 'Créer votre premier thème'
          }}
        </ActionButton>

        <p
          v-else
          class="mt-8 text-center text-lg font-semibold italic text-gray-400"
        >
          Vous n'avez accès aux thèmes d'aucun niveau.
        </p>
      </template>

      <template v-else>
        <SkeletonText v-for="index in 7" :key="index" class="my-4 w-full" xl />
      </template>
    </DataColumn>

    <div
      class="min-w-0 flex-1 overflow-scroll"
      :class="{ 'hidden md:block': dataColumnOpened }"
    >
      <template v-if="!programLoaded || selectedTheme">
        <div class="max-w-full p-8">
          <template v-if="programLoaded">
            <div class="flex flex-row">
              <div class="flex-1">
                <LargeTitle
                  >{{ selectedTheme.name }} -
                  {{ selectedTheme.level.fullName }}</LargeTitle
                >
                <p class="text-md font-semibold">
                  {{ selectedTheme.description }}
                </p>
              </div>
              <div class="flex">
                <ActionIcon
                  icon="edit"
                  class="my-4 mx-1"
                  @click="editSelectedTheme"
                  2xl
                  :disabled="selectedThemeUpdating"
                />
                <ActionIcon
                  :icon="
                    selectedTheme.visible ? 'visibility' : 'visibility_off'
                  "
                  class="my-4 mx-1"
                  @click="toggleSelectedThemeVisibility"
                  2xl
                  :disabled="selectedThemeUpdating"
                />
                <ActionIcon
                  icon="delete"
                  class="my-4 mx-1"
                  @click="deleteSelectedTheme"
                  2xl
                  :disabled="selectedThemeUpdating"
                />
              </div>
            </div>
          </template>

          <template v-else>
            <LargeTitle skeleton class="w-full max-w-md" />
            <SkeletonText class="w-full" xl />
            <SkeletonText class="w-full" xl />
            <SkeletonText class="w-full max-w-sm" xl />
          </template>

          <div class="mt-12 max-w-full md:mt-28">
            <template v-if="selectedThemeResourcesLoaded">
              <div class="max-w-full overflow-x-scroll">
                <DataTable
                  :columns="[
                    ['Nom', 'name'],
                    ['Message', 'message'],
                    ['Date', 'date'],
                    ['Type', 'type'],
                    ['Correction', 'correction'],
                    ['Ressources', 'content'],
                  ]"
                  :types="[
                    'primary',
                    'secondary',
                    'secondary',
                    'secondary',
                    'boolean',
                    'link[]',
                  ]"
                  :updatingStates="resourcesUpdating"
                  :data="selectedThemeResources"
                  createNewMessage="Ajouter une ressource"
                  @createNew="createNewResource"
                  @edit="editResource"
                  @toggle="toggleResource"
                  @delete="deleteResource"
                />
              </div>
            </template>

            <template v-else>
              <SkeletonText 3xl class="w-32" />
              <SkeletonText
                v-for="index in 7"
                :key="index"
                class="my-4 w-full"
                xl
              />
            </template>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="center h-main">
          <p class="m-2 text-center text-lg font-semibold italic text-gray-400">
            Sélectionnez un thème pour commencer.
          </p>
        </div>
      </template>
    </div>

    <RightPanel
      :isOpen="editThemePanelOpen"
      @cancel="cancelThemeEdit"
      :title="editedThemePanelTitle"
      description="
        Un thème correspond à un ou quelques chapitres de cours. Il permet de centraliser les ressources associées à un même sujet. Quand vous le créez, il est invisible pour les élèves.
      "
    >
      <form @submit.prevent="submitThemeEdit" @keydown="preventEnter">
        <Dropdown
          class="mt-4"
          :choices="teachingLevels"
          v-model="editedThemeLevel"
          label="Niveau"
        />

        <InputField
          class="mt-4"
          type="text"
          label="Nom"
          v-model="editedThemeName"
          placeholder="Tableaux de variation"
          compact
        />

        <TextArea
          class="mt-4 h-28"
          label="Description"
          v-model="editedThemeDescription"
          placeholder="Découvrez les tableaux de variation, un outil mathématique pour mieux appréhender les variations d'une fonction..."
          compact
        />

        <div class="flex place-content-between">
          <ActionButton
            cancel
            small
            class="mt-8 w-28"
            @click.prevent="cancelThemeEdit"
            >Annuler</ActionButton
          >
          <SubmitButton
            class="mt-8 w-28"
            :message="editThemePanelContinueMessage"
            :invalidFields="editThemePanelInvalidFields"
            :submitting="editThemePanelSubmitting"
            small
          />
        </div>
      </form>
    </RightPanel>

    <RightPanel
      :isOpen="editResourcePanelOpen"
      @cancel="cancelResourceEdit"
      :title="editResourcePanelTitle"
      description="
        Une ressource correspond à un ou plusieurs liens ou fichiers liés à un même document. Par exemple, les différentes pages d'une même interrogation. Quand vous ajoutez une ressource, elle est directement visible pour les élèves.
      "
    >
      <form @submit.prevent="submitResourceEdit" @keydown="preventEnter">
        <InputField
          class="mt-4"
          type="text"
          label="Nom"
          v-model="editedResourceName"
          placeholder="DS - Mai 2018"
          compact
        />

        <TextArea
          class="mt-4 h-28"
          label="Message"
          v-model="editedResourceMessage"
          placeholder="Les premiers exercices sont très simple, mais il faut réfléchir pour le dernier"
          compact
        />

        <InputDropdown
          class="mt-4"
          label="Type"
          v-model="editedResourceType"
          placeholder="DS"
          :choices="existingResourceTypes"
        />

        <div class="mt-4">
          <label>Correction</label>
          <HorizontalRadio
            :values="[NOT_CORRECTED, CORRECTED]"
            v-model="editedResourceCorrected"
            spaced
          />
        </div>
        <FileList
          label="Fichiers"
          class="mt-4"
          :files="editedResourceFiles"
          @files-added="addResourceFiles"
          @url-added="addResourceURL"
          @files-removed="removeResourceFiles"
        />

        <div class="flex place-content-between">
          <ActionButton
            cancel
            small
            class="mt-8 w-28"
            @click.prevent="cancelResourceEdit"
            >Annuler</ActionButton
          >
          <SubmitButton
            class="mt-8 w-28"
            :message="editThemePanelContinueMessage"
            :invalidFields="editResourcePanelInvalidFields"
            :submitting="editResourcePanelSubmitting"
            small
          />
        </div>
      </form>
    </RightPanel>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import DataColumn from './DataColumn.vue'
// @ts-ignore
import ActionButton from '@/components/style/ActionButton.vue'
// @ts-ignore
import ActionIcon from '@/components/style/ActionIcon.vue'
// @ts-ignore
import SubmitButton from '@/components/style/SubmitButton.vue'
// @ts-ignore
import Dropdown from '@/components/style/Dropdown.vue'
// @ts-ignore
import InputField from '@/components/style/InputField.vue'
// @ts-ignore
import TextArea from '@/components/style/TextArea.vue'
// @ts-ignore
import Icon from '@/components/style/Icon.vue'
// @ts-ignore
import RightPanel from './RightPanel.vue'
// @ts-ignore
import SkeletonText from '@/components/style/SkeletonText.vue'
// @ts-ignore
import SmallTitle from '@/components/style/SmallTitle.vue'
// @ts-ignore
import LargeTitle from '@/components/style/LargeTitle.vue'
// @ts-ignore
import DataTable from './DataTable.vue'
// @ts-ignore
import InputDropdown from '@/components/style/InputDropdown.vue'
// @ts-ignore
import HorizontalRadio from '@/components/style/HorizontalRadio.vue'
// @ts-ignore
import FileList from './FileList.vue'
import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { databaseClient } from '@/database/implementation'
import {
  MessageReplacer,
  MessageStack,
  MessageType,
} from '@/views/messages/message_stack'
import type {
  SchoolProgram,
  Theme,
  ThemeResource,
  ThemeResourceFile,
} from '@/database/interface/school_program'
import { Level } from '@/database/interface/level'
import { PopupManager, PopupType } from '@/views/popup/popup_manager'

type LevelThemesPair = {
  expanded: boolean
  level: Level
  themes: Theme[]
}

const CORRECTED = 'Corrigée'
const NOT_CORRECTED = 'Non corrigée'

const replacer = new MessageReplacer()

const dataColumnOpened = ref(false)

const editableLevelsPairs: Ref<LevelThemesPair[]> = ref([])

let editThemeIsCreating: Boolean | undefined = undefined
const editThemePanelOpen = ref(false)
const editedThemePanelTitle = ref('')
const editedThemeLevel = ref('')
const editedThemeName = ref('')
const editedThemeDescription = ref('')
const editThemePanelContinueMessage = ref('')
const editThemePanelInvalidFields = computed(() => {
  return (
    editThemePanelOpen.value &&
    (editedThemeLevel.value == null ||
      editedThemeName.value.length === 0 ||
      editedThemeDescription.value.length === 0)
  )
})
const editThemePanelSubmitting = ref(false)

const selectedTheme: Ref<Theme | undefined> = ref<Theme>()
const selectedThemeUpdating = ref(false)
const selectedThemeResources: Ref<ThemeResource[]> = ref<ThemeResource[]>([])
const selectedThemeResourcesLoaded = ref(false)
watch(selectedTheme, (newTheme) => {
  if (!newTheme) return
  selectedThemeResourcesLoaded.value = false
  selectedThemeResources.value = []
  databaseClient
    .getThemeResources(newTheme.uuid)
    .then((resources) => {
      refreshSelectedThemeResources(resources!!)
    })
    .catch(MessageStack.logError)
    .finally(() => {
      selectedThemeResourcesLoaded.value = true
    })
})

const editResourcePanelSubmitting = ref(false)

let editResourceIsCreating: Boolean | undefined = undefined
let editedResource: ThemeResource | undefined = undefined
const editResourcePanelOpen = ref(false)
const editResourcePanelTitle = ref('')
const editedResourceName = ref('')
const editedResourceMessage = ref('')
const editedResourceType = ref('')
const editedResourceFiles = ref<ThemeResourceFile[]>([])
const editedResourceCorrected = ref('')
const editResourceContinueMessage = ref('')
const editResourcePanelInvalidFields = computed(() => {
  return (
    editResourcePanelOpen.value &&
    (editedResourceName.value.length === 0 ||
      editedResourceMessage.value.length === 0 ||
      editedResourceType.value == null ||
      editedResourceFiles.value.length === 0)
  )
})

const resourcesUpdating: Ref<boolean[]> = ref([])

const existingResourceTypes: Ref<string[]> = ref<string[]>([])

const programLoaded = ref(false)
databaseClient
  .getAllProgram()
  .then(refreshProgram)
  .catch(MessageStack.logError)
  .finally(() => {
    programLoaded.value = true
  })

const teachingLevels: Ref<string[]> = ref([])
databaseClient
  .getTeachingLevels()
  .then((levels) => {
    teachingLevels.value = levels.map((level) => level.fullName)
  })
  .catch(MessageStack.logError)

const atLeastOneTheme = computed(() =>
  editableLevelsPairs.value.some((pair) => pair.themes.length > 0),
)

function addNewTheme() {
  editThemeIsCreating = true
  editedThemePanelTitle.value = 'Nouveau thème'
  editedThemeLevel.value = teachingLevels.value[0]
  editedThemeName.value = ''
  editedThemeDescription.value = ''
  editThemePanelContinueMessage.value = 'Créer'
  editThemePanelOpen.value = true
}

function editSelectedTheme() {
  editThemeIsCreating = false
  editedThemePanelTitle.value = 'Edition du thème'
  editedThemeLevel.value = selectedTheme.value!.level!.fullName
  editedThemeName.value = selectedTheme.value!.name
  editedThemeDescription.value = selectedTheme.value!.description
  editThemePanelContinueMessage.value = 'Enregistrer'
  editThemePanelOpen.value = true
}

function toggleSelectedThemeVisibility() {
  if (!selectedTheme.value) return

  selectedThemeUpdating.value = true
  replacer.replaceLastBy({
    type: MessageType.INFO,
    text: 'Modification en cours...',
  })

  databaseClient
    .updateTheme(selectedTheme.value.uuid, {
      ...selectedTheme.value,
      visible: !selectedTheme.value.visible,
    })
    .then(async () => {
      refreshProgram(await databaseClient.getAllProgram())
      replacer.replaceLastBy({
        type: MessageType.SUCCESS,
        text: 'Modification effectuée.',
      })
    })
    .catch((error) => {
      replacer.replaceLastBy({
        type: MessageType.ERROR,
        text: error.message ?? error.toString(),
      })
    })
    .finally(() => {
      selectedThemeUpdating.value = false
    })
}

function deleteSelectedTheme() {
  if (!selectedTheme.value) return

  PopupManager.getInstance().confirm({
    title: 'Suppression du thème',
    content: 'Êtes-vous sûr de vouloir supprimer ce thème ?',
    okMessage: 'Oui, supprimer',
    okCallback: () => {
      selectedThemeUpdating.value = true
      replacer.replaceLastBy({
        type: MessageType.INFO,
        text: 'Modification en cours...',
      })

      databaseClient
        .deleteTheme(selectedTheme.value!!.uuid)
        .then(async () => {
          refreshProgram(await databaseClient.getAllProgram())
          replacer.replaceLastBy({
            type: MessageType.SUCCESS,
            text: 'Modification effectuée.',
          })
        })
        .catch((error) => {
          replacer.replaceLastBy({
            type: MessageType.ERROR,
            text: error.message ?? error.toString(),
          })
        })
        .finally(() => {
          selectedThemeUpdating.value = false
        })
    },
    cancelMessage: 'Annuler',
  })
}

function cancelThemeEdit() {
  // First we search if the content have changed
  let contentChanged = false
  if (editThemeIsCreating) {
    contentChanged =
      editedThemeName.value.length > 0 ||
      editedThemeDescription.value.length > 0 ||
      editedThemeLevel.value != teachingLevels.value[0]
  } else {
    contentChanged =
      editedThemeName.value !== selectedTheme.value!.name ||
      editedThemeDescription.value !== selectedTheme.value!.description ||
      editedThemeLevel.value !== selectedTheme.value!.level!.fullName
  }

  if (contentChanged) {
    PopupManager.getInstance().confirm({
      title: 'Annuler',
      content:
        'Êtes-vous sûr de vouloir annuler ? Vos modifications seront perdues.',
      okMessage: 'Oui, annuler',
      cancelMessage: 'Non, retour',
      okCallback: () => {
        editThemePanelOpen.value = false
      },
    })
  } else {
    editThemePanelOpen.value = false
  }
}

function submitThemeEdit() {
  editThemePanelSubmitting.value = true
  let submittingPromise: Promise<Theme>
  let successMessage: string

  if (editThemeIsCreating) {
    replacer.replaceLastBy({
      type: MessageType.INFO,
      text: 'Création du thème en cours...',
    })
    successMessage = 'Le thème a été créé avec succès'
    submittingPromise = databaseClient.createTheme(
      editedThemeName.value,
      editedThemeDescription.value,
      Level.levelFromName(editedThemeLevel.value)!!,
    )
  } else {
    replacer.replaceLastBy({
      type: MessageType.INFO,
      text: 'Modification du thème en cours...',
    })
    successMessage = 'Le thème a été modifié avec succès'
    submittingPromise = databaseClient.updateTheme(selectedTheme.value!!.uuid, {
      ...selectedTheme.value!!,
      name: editedThemeName.value,
      description: editedThemeDescription.value,
      level: Level.levelFromName(editedThemeLevel.value)!!,
    })
  }

  submittingPromise
    .then(async () => {
      refreshProgram(await databaseClient.getAllProgram())
      replacer.replaceLastBy({
        type: MessageType.SUCCESS,
        text: successMessage,
      })
    })
    .catch((error) => {
      replacer.replaceLastBy({
        type: MessageType.ERROR,
        text: error.message ?? error.toString(),
      })
    })
    .finally(() => {
      editThemePanelSubmitting.value = false
      editThemePanelOpen.value = false
    })
}

function submitResourceEdit() {
  editResourcePanelSubmitting.value = true
  let submittingPromise: Promise<ThemeResource>
  let successMessage: string

  if (editResourceIsCreating) {
    replacer.replaceLastBy({
      type: MessageType.INFO,
      text: 'Création de la ressource en cours...',
    })

    submittingPromise = databaseClient.createThemeResource(
      selectedTheme.value!!.uuid,
      editedResourceName.value,
      editedResourceMessage.value,
      editedResourceType.value,
      editedResourceCorrected.value == CORRECTED,
      editedResourceFiles.value,
    )

    successMessage = 'La ressource a été créée avec succès'
  } else {
    replacer.replaceLastBy({
      type: MessageType.INFO,
      text: 'Modification de la ressource en cours...',
    })
    submittingPromise = databaseClient.updateThemeResource(
      selectedTheme.value!!.uuid,
      editedResource!!.uuid,
      editedResourceName.value,
      editedResourceMessage.value,
      editedResourceType.value,
      editedResourceCorrected.value == CORRECTED,
      editedResourceFiles.value,
    )

    successMessage = 'La ressource a été modifiée avec succès'
  }

  submittingPromise
    .then(async () => {
      refreshSelectedThemeResources(
        (await databaseClient.getThemeResources(selectedTheme.value!!.uuid))!!,
      )
      replacer.replaceLastBy({
        type: MessageType.SUCCESS,
        text: successMessage,
      })
    })
    .catch((error) => {
      replacer.replaceLastBy({
        type: MessageType.ERROR,
        text: error.message ?? error.toString(),
      })
    })
    .finally(() => {
      editResourcePanelSubmitting.value = false
      editResourcePanelOpen.value = false
    })
}

function selectTheme(theme: Theme) {
  selectedTheme.value = theme
}

function togglePairExpansion(pair: LevelThemesPair) {
  pair.expanded = !pair.expanded
}

async function refreshProgram(program: SchoolProgram) {
  const teachingLevels = await databaseClient.getTeachingLevels()
  editableLevelsPairs.value = teachingLevels.map((level) => {
    return {
      expanded: true,
      level: level,
      themes: program.get(level),
    }
  })

  if (!selectedTheme.value) {
    const firstTheme = editableLevelsPairs.value?.find(
      (pair) => pair.themes.length > 0,
    )?.themes[0]
    if (firstTheme) {
      selectedTheme.value = firstTheme
    }
  } else {
    selectedTheme.value =
      program.find((theme) => theme.uuid == selectedTheme.value!!.uuid) ??
      undefined
  }
}

async function refreshSelectedThemeResources(resources: ThemeResource[]) {
  selectedThemeResources.value = resources.sort((a, b) =>
    a.name.localeCompare(b.name),
  )
  resourcesUpdating.value = resources.map(() => false)
  existingResourceTypes.value = (
    await databaseClient.getThemeResourceTypes()
  ).map((type) => type.name)
}

function createNewResource() {
  editResourceIsCreating = true
  editResourcePanelOpen.value = true
  editResourcePanelTitle.value = 'Nouvelle ressource'
  editedResourceName.value = ''
  editedResourceMessage.value = ''
  editedResourceType.value = ''
  editedResourceFiles.value = []
  editedResourceCorrected.value = NOT_CORRECTED
  editResourceContinueMessage.value = 'Créer'
}

function editResource(index: number) {
  editResourceIsCreating = false
  editResourcePanelOpen.value = true
  editResourcePanelTitle.value = 'Modification de la ressource'
  editedResource = selectedThemeResources.value!![index]
  editedResourceName.value = editedResource.name
  editedResourceMessage.value = editedResource.message
  editedResourceType.value = editedResource.type
  editedResourceFiles.value = [...editedResource.content] // Copy the array
  editedResourceCorrected.value = editedResource.correction
    ? CORRECTED
    : NOT_CORRECTED
  editResourceContinueMessage.value = 'Enregistrer'
}

function toggleResource(index: number) {
  resourcesUpdating.value[index] = true

  replacer.replaceLastBy({
    type: MessageType.INFO,
    text: 'Modification de la ressource en cours...',
  })

  databaseClient
    .changeThemeResourceVisibility(
      selectedTheme.value!!.uuid,
      selectedThemeResources.value!![index].uuid,
      !selectedThemeResources.value!![index].visible,
    )
    .then(async () => {
      replacer.replaceLastBy({
        type: MessageType.SUCCESS,
        text: 'La ressource a été modifiée avec succès',
      })
      refreshSelectedThemeResources(
        (await databaseClient.getThemeResources(selectedTheme.value!!.uuid))!!,
      )
    })
    .catch((error) => {
      replacer.replaceLastBy({
        type: MessageType.ERROR,
        text: error.message ?? error.toString(),
      })
    })
    .finally(() => {
      resourcesUpdating.value[index] = false
    })
}

function deleteResource(index: number) {
  PopupManager.getInstance().confirm({
    title: 'Suppression de la ressource',
    content: 'Etes-vous sûr de vouloir supprimer cette ressource ?',
    okMessage: 'Supprimer',
    cancelMessage: 'Annuler',
    okCallback: () => {
      resourcesUpdating.value[index] = true

      replacer.replaceLastBy({
        type: MessageType.INFO,
        text: 'Suppression de la ressource en cours...',
      })

      databaseClient
        .deleteThemeResource(
          selectedTheme.value!!.uuid,
          selectedThemeResources.value!![index].uuid,
        )
        .then(async () => {
          replacer.replaceLastBy({
            type: MessageType.SUCCESS,
            text: 'La ressource a été supprimée avec succès',
          })
          refreshSelectedThemeResources(
            (await databaseClient.getThemeResources(
              selectedTheme.value!!.uuid,
            ))!!,
          )
        })
        .catch((error) => {
          replacer.replaceLastBy({
            type: MessageType.ERROR,
            text: error.message ?? error.toString(),
          })
        })
        .finally(() => {
          resourcesUpdating.value[index] = false
        })
    },
  })
}

function cancelResourceEdit() {
  let contentChanged = false
  if (editResourceIsCreating) {
    contentChanged =
      editedResourceName.value.length > 0 ||
      editedResourceMessage.value.length > 0 ||
      editedResourceType.value.length > 0 ||
      editedResourceFiles.value.length > 0
  } else {
    contentChanged =
      editedResourceName.value != editedResource!!.name ||
      editedResourceMessage.value != editedResource!!.message ||
      editedResourceType.value != editedResource!!.type ||
      editedResourceFiles.value != editedResource!!.content
  }

  if (contentChanged) {
    PopupManager.getInstance().confirm({
      title: 'Annuler',
      content:
        'Êtes-vous sûr de vouloir annuler ? Vos modifications seront perdues.',
      okMessage: 'Oui, annuler',
      cancelMessage: 'Non, retour',
      okCallback: () => {
        editResourcePanelOpen.value = false
      },
    })
  } else {
    editResourcePanelOpen.value = false
  }
}

function addResourceFiles(files: FileList) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    // https://github.com/supabase/supabase/discussions/2480
    if (
      !/^(\w|\/|!|-|\.|\*|'|\(|\)| |&|\$|@|=|;|:|\+|,|\?)*$/.test(file.name)
    ) {
      MessageStack.getInstance().push({
        type: MessageType.ERROR,
        text:
          'Le nom du fichier "' +
          file.name +
          '" contient des caractères non autorisés et n\'a donc pas été ajouté.',
      })
    } else if (
      editedResourceFiles.value.find(
        (existingFile) => (existingFile as any).name === file.name,
      )
    ) {
      MessageStack.getInstance().push({
        type: MessageType.ERROR,
        text:
          'Le fichier "' +
          file.name +
          '" existe déjà et n\'a donc pas été ajouté.',
      })
    } else {
      editedResourceFiles.value.push({
        name: file.name,
        file: file,
      })
    }
  }
}

function addResourceURL(url: string) {
  if (
    editedResourceFiles.value.find(
      (existingFile) => (existingFile as any).url === url,
    )
  ) {
    MessageStack.getInstance().push({
      type: MessageType.ERROR,
      text: 'L\'URL "' + url + '" existe déjà et n\'a donc pas été ajoutée.',
    })
  } else {
    editedResourceFiles.value.push({
      url: url,
    })
  }
}

function removeResourceFiles(index: number) {
  editedResourceFiles.value.splice(index, 1)
}

function preventEnter(event: KeyboardEvent) {
  if (event.key == 'Enter') {
    event.preventDefault()
  }
}
</script>

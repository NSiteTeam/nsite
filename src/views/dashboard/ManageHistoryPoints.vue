<template>
  <div class="flex h-full w-full">
    <DataColumn title="Points d'Histoire">
      <div
        v-for="(historyPoint, index) in historyPoints"
        :key="index"
        @click="selectHistoryPoint(historyPoint)"
        class="my-4 cursor-pointer whitespace-normal p-2 text-lg font-bold text-gray-500"
        :class="{
          'rounded-lg bg-gray-200': historyPoint == selectedPoint,
        }"
      >
        {{ historyPoint.title }}
      </div>
      <ActionButton
        @click="addHistoryPoint"
        primary
        class="flex items-center p-4"
      >
        <span class="material-icons">add</span>
        Ajouter un point
      </ActionButton>
    </DataColumn>

    <!-- Contains the body of the page -->
    <div class="h-full w-full min-w-0 flex-1" v-if="selectedPoint">
      <div class="flex w-full flex-row justify-between p-4">
        <MediumTitle>Modifier le point d'histoire</MediumTitle>
        <div class="flex w-96 justify-around">
          <span
            @click="toggleVisibility"
            class="flex cursor-pointer items-center font-bold"
          >
            Visibilité
            <span class="material-icons ml-2 cursor-pointer">
              visibility{{ selectedPoint.visible ? '_on' : '_off' }}
            </span>
          </span>
          <span
            @click="handleDelete"
            class="flex cursor-pointer items-center font-bold text-red-600"
          >
            Supprimer
            <span class="material-icons mx-2 cursor-pointer"> delete </span>
          </span>
        </div>
      </div>
      <div class="p-4">
        <div class="flex flex-wrap items-center justify-between">
          <div class="">
            <label for="content" class="block text-xl font-bold text-gray-800"
              >Titre du point d'histoire</label
            >
            <InputField
              class="block w-[500px] text-xl font-bold"
              v-model="selectedPoint.title"
              id="title"
            />
          </div>
          <div class="">
            <label for="content" class="block text-xl font-bold text-gray-800"
              >Date</label
            >
            <input
              class="input-style w-64"
              v-model="selectedPoint.date"
              id="title"
            />
          </div>
        </div>
        <label for="content" class="mt-4 block text-xl font-bold text-gray-800"
          >Sous-titre</label
        >
        <InputField
          class="block w-full text-xl font-bold md:w-2/3"
          v-model="selectedPoint.subtitle"
          id="subtitle"
        />
        <div class="mt-4 flex w-full flex-wrap lg:flex-nowrap">
          <div>
            <span class="mb-4 text-xl font-bold text-gray-800">Contenu</span>
            <textarea
              class="block h-64 w-96 rounded-lg p-3 font-mono text-sm outline-primary"
              v-model="selectedPoint.content"
            />
          </div>
          <div class="ml-4">
            <span class="mb-4 text-xl font-bold text-gray-800">Aperçu</span>
            <div class="h-64 w-fit overflow-y-scroll">
              <Markdown :rawText="selectedPoint.content" />
            </div>
          </div>
        </div>
        <a
          class="mt-2 block text-primary underline"
          href="https://www.christopheducamp.com/2014/09/18/love-markdown/#table-des-matières"
          target="_blank"
        >
          <Icon icon="open_in_new" />
          Antisèche sur le language de mise en forme markdown
        </a>
        <FileList
          label="Images"
          boldLabel
          image
          class="mt-4 w-full md:w-2/3"
          @files-added="uploadFile"
        />
        <div class="mb-16 flex flex-wrap">
          <div
            v-for="(image, index) in selectedPoint.images"
            :key="index"
            class="h-70 relative my-4 mr-4 w-auto rounded-xl bg-gray-200 p-4"
          >
            <ImageActions :image="image" @delete="deleteImage" />
            <img class="h-64 pb-2" :src="image.url" alt="Image ajoutée" />
            <div class="flex flex-col justify-center">
              <div class="items-strech flex w-full justify-center">
                <Icon
                  @click="handleSwap(index, index - 1)"
                  class="my-1 rounded-lg bg-gray-300 px-2"
                  icon="arrow_back"
                />
                <InputField v-model="image.label" />
                <Icon
                  @click="updateImageLabel(image.id, image.label)"
                  class="my-2 mx-2 rounded-xl bg-primary px-2 text-white"
                  icon="save"
                />
                <Icon
                  @click="handleSwap(index, index + 1)"
                  class="my-1 rounded-lg bg-gray-300 px-2"
                  icon="arrow_forward"
                />
              </div>
              <!-- <em v-if="image.label" class="text-sm flex justify-center text-center text-primary">
                <Icon class="mr-1" icon="warning" />
                N'oubliez pas de sauvegarder
              </em> -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- If the user hasn't selected anything, display this -->
    <div class="flex h-full w-full flex-1 items-center justify-center" v-else>
      <MediumTitle class="w-96 rounded-xl bg-primary p-4 text-white"
        >Choisissez un point d'histoire à modifier</MediumTitle
      >
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import DataColumn from '@/views/dashboard/DataColumn.vue'
// @ts-ignore
import LargeTitle from '@/components/style/LargeTitle.vue'
// @ts-ignore
import MediumTitle from '@/components/style/MediumTitle.vue'
// @ts-ignore
import TextArea from '../../components/style/TextArea.vue'
// @ts-ignore
import InputField from '../../components/style/InputField.vue'
// @ts-ignore
import ActionButton from '../../components/style/ActionButton.vue'
// @ts-ignore
import FileList from './FileList.vue'
// @ts-ignore
import ImageActions from '@/components/style/ImageActions.vue'
// @ts-ignore
import Markdown from '@/components/style/Markdown.vue'
// @ts-ignore
import Icon from '@/components/style/Icon.vue'
import type { HistoryPoint } from '@/database/interface/history_point'
import { onUnmounted, ref, shallowRef } from 'vue'
import { deleteElementInArray, moveElInArray } from '@/utils/misc_utils'
import { databaseClient } from '@/database/implementation'
import { PopupManager } from '../popup/popup_manager'
import { pushError, pushInfo, pushSuccess } from '../messages/message_stack'
import type { ImageWithLabel } from '@/database/interface/image_with_label'

onUnmounted(() => {
  if (selectedPoint.value) handleUpdate()
})

function handleSwap(oldIndex: number, newIndex: number) {
  if (selectedPoint.value)
    selectedPoint.value.images = moveElInArray(
      selectedPoint.value?.images!!,
      oldIndex,
      newIndex,
    )
}

async function updateImageLabel(id: number, newLabel: string) {
  try {
    await databaseClient.updateImageLabel(id, newLabel)
    pushSuccess("La légende a bien été sauvegardé")
  } catch {
    pushError("Quelque chose ne s'est pas bien passé")
  }
}

async function uploadFile(file: File[]) {
  pushInfo("L'image est en cours d'acheminement")

  console.log('Trying to upload image', file)

  const { data, error } = await databaseClient.uploadImage(
    file[0],
    '',
    'history_points',
    selectedPoint.value?.title!!,
  )

  pushSuccess("L'image a bien été ajoutée")

  if (data) selectedPoint.value?.images.push(data)
  if (
    error == 'duplicate key value violates unique constraint "bucketid_objname"'
  ) {
    pushError('Fichier déjà envoyé')
  } else if (error) {
    pushError(error)
  }
}

async function deleteImage(image: ImageWithLabel) {
  if (!selectedPoint.value) return
  pushInfo("L'image est en cours de suppression")

  const { error } = await databaseClient.deleteImage(image.url)
  if (error) return pushError(error)

  selectedPoint.value.images = deleteElementInArray(
    selectedPoint.value.images,
    image,
  )

  pushSuccess("L'image a bien été supprimé")
}

function selectHistoryPoint(historyPoint: HistoryPoint | null) {
  selectedPoint.value = historyPoint
  handleUpdate()
}

function handleUpdate() {
  databaseClient
    .updateHistoryPoint(selectedPoint.value as HistoryPoint)
    .then(() => {
      pushSuccess("Le point d'histoire a bien été modifié")
    })
    .catch((err) => {
      console.error(err.message)
      pushError("Quelque chose s'est mal passé")
    })
}

function handleDelete() {
  const deletePoint = () => {
    databaseClient
      .deleteHistoryPoint(selectedPoint.value as HistoryPoint)
      .then(() => {
        pushSuccess("Le point d'histoire a bien été supprimé")
      })
      .catch(() => pushError("Quelque chose s'est mal passé"))
    selectHistoryPoint(null)
  }

  PopupManager.getInstance().confirm({
    title: "Êtes-vous sûrs de supprimer ce point d'histoire ?",
    content: 'Cette action est irréversible !',
    cancelMessage: 'Annuler',
    okMessage: 'Supprimer',
    okCallback: deletePoint,
  })
}

function addHistoryPoint() {
  const createHistoryPoint = (value: string) => {
    databaseClient
      .createEmptyHistoryPoint(value)
      .then(() => pushSuccess("Le point d'histoire a bien été créé"))
      .catch((err) => {
        console.error(err)
        pushError("Quelque chose s'est mal passé")
      })
  }

  PopupManager.getInstance().prompt({
    title: "Ajoutez un point d'histoire",
    message: 'Entrez un titre',
    default: "Point d'histoire sans titre",
    placeholder: "Ex: L'histoire des vecteurs",
    okMessage: 'Créer',
    cancelMessage: 'Annuler',
    onConfirm: createHistoryPoint,
    computeError: (value: string) => {
      return !value || value ? '' : 'Un titre est requis'
    },
  })
}

function toggleVisibility() {
  if (selectedPoint.value)
    selectedPoint.value.visible = !selectedPoint.value.visible as boolean
}

await databaseClient.fetchHistoryPoints()
const selectedPoint = ref<HistoryPoint | null>(null)

const historyPoints = databaseClient.fetchedHistoryPoints
  .value as HistoryPoint[]
</script>

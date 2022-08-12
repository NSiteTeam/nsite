<template>
  <div class="flex h-full w-full">
    <DataColumn title="Actualités">
      <div
        v-for="(historyPoint, index) in historyPoints"
        :key="index"
        @click="selectNews(historyPoint)"
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
        <LargeTitle>Modifier le point d'histoire</LargeTitle>
        <div class="flex">
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
            <label for="content" class="block text-2xl font-bold text-gray-800"
              >Titre du point d'histoire</label
            >
            <InputField
              class="block w-[500px] text-2xl font-bold"
              v-model="selectedPoint.title"
              id="title"
            />
          </div>
          <div class="">
            <label for="content" class="block text-2xl font-bold text-gray-800"
              >Date</label
            >
            <input
              class="input-style w-64"
              v-model="selectedPoint.date"
              id="title"
            />
          </div>
        </div>
        <label for="content" class="mt-4 block text-2xl font-bold text-gray-800"
          >Sous-titre</label
        >
        <InputField
          class="block w-full text-xl font-bold md:w-2/3"
          v-model="selectedPoint.subtitle"
          id="subtitle"
        />
        <label for="content" class="mt-4 block text-2xl font-bold text-gray-800"
          >Contenu</label
        >
        <TextArea
          class="block h-64 w-full"
          v-model="selectedPoint.content"
          id="content"
        />
        <FileList
          label="Images"
          boldLabel
          class="mt-4 w-full md:w-2/3"
          @files-added="uploadFile"
        />
        <div class="mb-16 flex flex-wrap">
          <div
            v-for="(imageUrl, index) in selectedPoint.imageUrls"
            :key="index"
            class="relative my-4 mr-4 h-64 w-auto rounded-xl bg-gray-200 p-4"
          >
            <ImageActions :url="imageUrl" @delete="deleteImage" />
            <img class="h-64" :src="imageUrl" alt="Image ajoutée" />
          </div>
        </div>
      </div>
    </div>

    <!-- If the user hasn't selected anything, display this -->
    <div class="flex h-full w-full items-center justify-center" v-else>
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
import type { HistoryPoint } from '@/database/interface/history_point'
import type { ShallowRef } from 'vue'
import { onUnmounted, shallowRef } from 'vue'
import { deleteElementInArray } from '@/utils/string_utils'
import { databaseClient } from '@/database/implementation'
import { PopupManager } from '../popup/popup_manager'
import { MessageStack, MessageType } from '../messages/message_stack'

onUnmounted(handleUpdate)

function displayErrorMessage(text: string) {
  MessageStack.getInstance().push({
    text: text,
    type: MessageType.ERROR,
  })
}

function displayInfo(message: string): void {
  MessageStack.getInstance().push({
    text: message,
    type: MessageType.INFO,
  })
}

async function uploadFile(file: File[]) {
  displayInfo("L'image est en cours d'acheminement")

  console.log('Trying to upload image', file)
  const { data, error } = await databaseClient.uploadImage(
    file[0],
    'history_points',
    selectedPoint.value?.title!!,
  )

  MessageStack.getInstance().push({
    text: "L'image a bien été ajoutée",
    type: MessageType.SUCCESS,
  })

  if (data) selectedPoint.value?.imageUrls.push(data)
  if (
    error == 'duplicate key value violates unique constraint "bucketid_objname"'
  ) {
    displayErrorMessage('Fichier déjà envoyé')
  } else if (error) {
    displayErrorMessage(error)
  }
}

async function deleteImage(url: string) {
  if (!selectedPoint.value) return
  displayInfo("L'image est en cours de suppression")

  const { error } = await databaseClient.deleteImage(url)
  if (error) return displayErrorMessage(error)

  console.log(url)
  selectedPoint.value.imageUrls = deleteElementInArray(
    selectedPoint.value.imageUrls,
    url,
  )

  MessageStack.getInstance().push({
    text: "L'image a bien été supprimé",
    type: MessageType.SUCCESS,
  })
}

function selectNews(historyPoint: HistoryPoint | null) {
  selectedPoint.value = historyPoint
  handleUpdate()
}

function handleUpdate() {
  console.log(selectedPoint.value?.imageUrls)
  databaseClient
    .updateHistoryPoint(selectedPoint.value as HistoryPoint)
    .then(() => {
      MessageStack.getInstance().push({
        text: "Le point d'histoire a bien été modifié",
        type: MessageType.SUCCESS,
      })
    })
    .catch((err) => {
      console.error(err.message)
      displayErrorMessage("Quelque chose s'est mal passé")
    })
}

function handleDelete() {
  const deletePoint = () => {
    databaseClient
      .deleteHistoryPoint(selectedPoint.value as HistoryPoint)
      .then(() => {
        MessageStack.getInstance().push({
          text: "Le point d'histoire a bien été supprimé",
          type: MessageType.SUCCESS,
        })
      })
      .catch(() =>
        MessageStack.getInstance().push({
          text: "Quelque chose s'est mal passé",
          type: MessageType.ERROR,
        }),
      )
    selectNews(null)
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
      .then(() =>
        MessageStack.getInstance().push({
          text: "Le point d'histoire a bien été créé",
          type: MessageType.SUCCESS,
        }),
      )
      .catch((err) => {
        console.error(err)
        displayErrorMessage("Quelque chose s'est mal passé")
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
const selectedPoint: ShallowRef<HistoryPoint | null> = shallowRef(null)

const historyPoints = databaseClient.fetchedHistoryPoints
  .value as HistoryPoint[]
</script>

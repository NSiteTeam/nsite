<template>
  <div class="flex h-full w-full">
    <DataColumn title="Actualités">
      <div
        v-for="(ActualNews, index) in AllNews"
        :key="index"
        @click="selectNews(ActualNews)"
        class="my-4 cursor-pointer whitespace-normal text-lg font-bold text-gray-500"
      >
        {{ ActualNews.title }}
      </div>
      <ActionButton
        @click="addNews"
        primary
        class="flex items-center p-4"
      >
        <span class="material-icons">add</span>
        Ajouter une news
      </ActionButton>
    </DataColumn>

    <div class="h-full w-full min-w-0 flex-1" v-if="selectedPoint">
      <div class="flex w-full flex-row justify-between p-4">
        <LargeTitle>Modifier l'actualité</LargeTitle>
        <div class="flex">
          <span
            @click="handleDelete"
            class="flex cursor-pointer items-center font-bold text-red-600"
          >
            Supprimer :
            <span class="material-icons mx-2 cursor-pointer"> delete </span>
          </span>
          <span
            @click="toggleVisibility"
            class="flex cursor-pointer items-center font-bold"
          >
            Visibilité :
            <span class="material-icons ml-2 cursor-pointer">
              visibility{{ selectedPoint.visible ? '_on' : '_off' }}
            </span>
          </span>
        </div>
      </div>
      <div class="p-4">
        <div class="flex flex-wrap items-center justify-between">
          <div class="">
            <label for="content" class="block text-2xl font-bold text-gray-800"
              >Titre: </label
            >
            <InputField
              class="block w-[500px] text-2xl font-bold"
              v-model="selectedPoint.title"
              id="title"
            />
          </div>
        </div>
        <label for="content" class="mt-4 block text-2xl font-bold text-gray-800"
          >Sous-titre:</label
        >
        <InputField
          class="block text-xl font-bold"
          v-model="selectedPoint.subtitle"
          id="subtitle"
        />
        <label for="content" class="mt-4 block text-2xl font-bold text-gray-800"
          >Contenu: </label
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

    <div class="flex h-full w-full items-center justify-center" v-else>
      <MediumTitle class="w-96 rounded-xl bg-primary p-4 text-white"
        >Choisissez une actualité à modifier ou créez en une nouvelle</MediumTitle
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
import type { News } from '@/database/interface/news'
import type { ShallowRef } from 'vue'
import { onUnmounted, shallowRef } from 'vue'
import { databaseClient } from '@/database/implementation'
import { PopupManager } from '../popup/popup_manager'
import { MessageStack, MessageType } from '../messages/message_stack'
import { deleteElementInArray } from '@/utils/misc_utils'

onUnmounted(handleUpdate)

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
    '',
    'news',
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

function selectNews(actualite: News | null) {
  selectedPoint.value = actualite
  handleUpdate()
}

function handleUpdate() {
  console.log(selectedPoint.value?.imageUrls)
  databaseClient
    .updateNews(selectedPoint.value as News)
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
      .deleteNews(selectedPoint.value as News)
      .then(() => {
        MessageStack.getInstance().push({
          text: "L'actualité a bien été supprimée",
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
    title: "Êtes-vous sûrs de supprimer cette actualité ?",
    content: 'Cette action est irréversible !',
    cancelMessage: 'Annuler',
    okMessage: 'Supprimer',
    okCallback: deletePoint,
  })
}

function displayErrorMessage(text: string) {
  MessageStack.getInstance().push({
    text: text,
    type: MessageType.ERROR,
  })
}

function addNews() {
  const createNews = (value: string) => {
    databaseClient
      .createEmptyNews(value)
      .then(() =>
        MessageStack.getInstance().push({
          text: "L'actualité a bien été créée",
          type: MessageType.SUCCESS,
        }),
      )
      .catch((err) => {
        console.error(err)
        displayErrorMessage("Quelque chose s'est mal passé")
      })
  }

  PopupManager.getInstance().prompt({
    title: "Ajoutez une actualité",
    message: 'Entrez un titre pour',
    default: "Nouvelle actualité",
    placeholder: "Ex: Grande fête de Saint Jean",
    okMessage: 'Créer',
    cancelMessage: 'Annuler',
    onConfirm: createNews,
    computeError: (value: string) => {
      return !value || value ? '' : 'Un titre est requis'
    },
  })
}

function toggleVisibility() {
  if (selectedPoint.value)
    selectedPoint.value.visible = !selectedPoint.value.visible as boolean
}

await databaseClient.fetchNews(300, false)
const selectedPoint: ShallowRef<News | null> = shallowRef(null)

const AllNews = databaseClient.fetchedNews
  .value as News[]

</script>

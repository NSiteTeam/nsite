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

    <!-- Contains the body of the page -->
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
        <div class="flex w-full flex-row-reverse">
          <ActionButton @click="handleUpdate" class="mt-8 mr-8" primary
            >Sauvegarder</ActionButton
          >
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
import type { HistoryPoint } from '@/database/interface/history_point'
import type { News } from '@/database/interface/news'
import type { ShallowRef } from 'vue'
import { shallowRef } from 'vue'
import { databaseClient } from '@/database/implementation'
import { PopupManager } from '../popup/popup_manager'
import { MessageStack, MessageType } from '../messages/message_stack'

function selectNews(actualite?: News) {
  selectedPoint.value = actualite
}

function handleUpdate() {
  databaseClient
    .updateNews(selectedPoint.value as News)
    .then(() => {
      MessageStack.getInstance().push({
        text: "L'actualité a bien été modifiée",
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
    selectNews()
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
const selectedPoint: ShallowRef<News | undefined> = shallowRef()

const AllNews = databaseClient.fetchedNews
  .value as News[]

</script>

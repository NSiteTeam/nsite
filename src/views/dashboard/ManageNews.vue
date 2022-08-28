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
            v-for="(image, index) in selectedPoint.images"
            :key="index"
            class="relative my-4 mr-4 w-auto rounded-xl bg-gray-200 p-4"
          >
            <ImageActions :image="image" @delete="deleteImage" />
            <img class="h-64" :src="image.url" alt="Image ajoutée" />
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
                  class="my-2 mx-2 rounded-xl bg-primary hover:bg-primary/90 px-2 text-white"
                  icon="save"
                />
                <Icon
                  @click="handleSwap(index, index + 1)"
                  class="my-1 rounded-lg bg-gray-300 px-2"
                  icon="arrow_forward"
                />
              </div>
            </div>
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
// @ts-ignore
import Icon from '@/components/style/Icon.vue'
import type { News } from '@/database/interface/news'
import type { ShallowRef } from 'vue'
import { onUnmounted, shallowRef } from 'vue'
import { databaseClient } from '@/database/implementation'
import { PopupManager } from '../popup/popup_manager'
import { MessageStack, MessageType, pushError, pushSuccess } from '../messages/message_stack'
import { deleteElementInArray, moveElInArray } from '@/utils/misc_utils'
import type { ImageWithLabel } from '@/database/interface/image_with_label'

onUnmounted(() => {
  if (selectedPoint.value) handleUpdate()
})

function displayInfo(message: string): void {
  MessageStack.getInstance().push({
    text: message,
    type: MessageType.INFO,
  })
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
  displayInfo("L'image est en cours d'acheminement")

  console.log('Trying to upload image', file)
  const { data, error } = await databaseClient.uploadImage(
    file[0],
    '',
    'news',
    selectedPoint.value?.title!!,
  )

  pushSuccess("L'image a bien été ajoutée")

  if (data) selectedPoint.value?.images.push(data)
  if (
    error == 'duplicate key value violates unique constraint "bucketid_objname"'
  ) {
    displayErrorMessage('Image déjà envoyé')
  } else if (error) {
    displayErrorMessage(error)
  }
}

async function deleteImage(image: ImageWithLabel) {
  if (!selectedPoint.value) return
  displayInfo("L'image est en cours de suppression")

  const { error } = await databaseClient.deleteImage(image.url)
  if (error) return displayErrorMessage(error)

  selectedPoint.value.images = deleteElementInArray(
    selectedPoint.value.images,
    image,
  )

  pushSuccess("L'image a bien été supprimé")
}

function selectNews(actualite: News | null) {
  selectedPoint.value = actualite
  handleUpdate()
}

function handleSwap(oldIndex: number, newIndex: number) {
  if (selectedPoint.value)
    selectedPoint.value.images = moveElInArray(
      selectedPoint.value?.images!!,
      oldIndex,
      newIndex,
    )
}

function handleUpdate() {
  console.log(selectedPoint.value?.images)
  databaseClient
    .updateNews(selectedPoint.value as News)
    .then(() => {
      pushSuccess("L'actualité a bien été modifié")
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
        pushSuccess("L'actualité a bien été supprimée")
      })
      .catch(() =>
        pushError("Quelque chose s'est mal passé")
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
        pushSuccess("L'actualité a bien été créée")
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

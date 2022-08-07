<template>
  <div class="flex h-full w-full">
    <!-- Contains the sidebar of the history points -->
    <DataColumn title="Points d'histoire">
      <div
        v-for="(newsArticle, index) in historyPoints"
        :key="index"
        @click="selectNews(newsArticle)"
        class="my-4 cursor-pointer whitespace-normal text-lg font-bold text-gray-500"
      >
        {{ newsArticle.title }}
      </div>
    </DataColumn>

    <!-- Contains the body of the page -->
    <div class="h-full w-full p-8" v-if="selectedPoint">
      <span
        @click="toggleVisibility"
        class="flex cursor-pointer items-center font-bold"
      >
        Visibilité :
        <span class="material-icons mx-2 cursor-pointer">
          visibility{{ selectedPoint.visible ? '_on' : '_off' }}
        </span>
      </span>
      <span
        @click="toggleVisibility"
        class="flex cursor-pointer items-center font-bold text-red-600"
      >
        Supprimer :
        <span class="material-icons mx-2 cursor-pointer"> delete </span>
      </span>
      <div class="flex items-center justify-between">
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
            v-model="selectedPoint.date.year"
            id="title"
          />
        </div>
      </div>
      <label for="content" class="mt-4 block text-2xl font-bold text-gray-800"
        >Sous-titre du point d'histoire</label
      >
      <InputField
        class="block text-xl font-bold"
        v-model="selectedPoint.subtitle"
        id="subtitle"
      />
      <label for="content" class="mt-4 block text-2xl font-bold text-gray-800"
        >Contenu du point d'histoire</label
      >
      <TextArea
        class="block h-64 w-full"
        v-model="selectedPoint.content"
        id="content"
      />
      <ActionButton class="mt-8 ml-4" primary>Envoyer</ActionButton>
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
import type { Ref, ShallowRef } from 'vue'
import { ref, shallowRef } from 'vue'
import { databaseClient } from '@/database/implementation'
import { PopupManager } from '../popup/popup_manager'
import {
  MessageStack,
  MessageType,
  MessageReplacer,
} from '../messages/message_stack'
import type { HistoryPoint } from '@/database/interface/history_point'

function selectNews(historyPoint: HistoryPoint) {
  selectedPoint.value = historyPoint
}

function toggleVisibility() {
  if (selectedPoint.value)
    selectedPoint.value.visible = !selectedPoint.value.visible as boolean
}

await databaseClient.fetchHistoryPoints()
const selectedPoint: ShallowRef<HistoryPoint | undefined> = shallowRef()

const historyPoints = databaseClient.fetchedHistoryPoints
  .value as HistoryPoint[]
</script>

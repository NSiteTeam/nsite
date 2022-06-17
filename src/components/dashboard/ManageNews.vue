<template>
  <div :class="messageClass" v-if="message">{{ message }}</div>

  <DataColumn
    @createData="addNews"
    @selectData="selectNews"
    title="Actualités"
    add-button-message="Ajouter une actualité"
    :list="news"
    :toText="newsToText"
    :to-key="newsToKey"
  >
    <template v-slot="slotProps">
      {{ slotProps.text }}
      <ContextMenu>
        <ContextMenuElement
          :icon="slotProps.data.visible ? 'visibility_off' : 'visibility'"
          :message="slotProps.data.visible ? 'Cacher' : 'Montrer'"
          @click.prevent="switchVisibilityOfNews(slotProps.data)"
        />
        <ContextMenuElement
          icon="delete"
          message="Supprimer"
          @click.prevent="deleteNews(slotProps.data)"
        />
      </ContextMenu>
    </template>
  </DataColumn>

  <div v-if="!selectedNews" class="center-text">
    <span>Aucune actualité n'est séléctionnée</span>
  </div>
  <div v-else id="form-center">
    <form id="news-form-container" @submit="save">
      <div id="news-form-title-container">
        <label id="news-title-label" for="news-form-title">Titre</label>
        <input
          id="news-form-title"
          v-model.trim="selectedNews.title"
          placeholder="Nouvelle édition des Olympiades de mathématiques"
        />
        <input
          type="date"
          :value="selectedNews.date.toForm()"
          @input="setDate"
        />
      </div>
      <div id="level-concerned-container">
        <span id="level-concerned">Niveaux concernés</span>
        <template v-for="level in levels" :key="level.index">
          <input
            :checked="isConcerned(level)"
            @input="setConcerned(level)"
            type="checkbox"
            :id="'level-checkbox-' + level.index"
            class="level-checkbox"
          />
          <label
            :for="'level-checkbox-' + level.index"
            class="level-checkbox-label"
          >
            {{ level.abbreviated }}
          </label>
        </template>
      </div>
      <textarea
        v-model.trim="selectedNews.content"
        id="news-textarea"
        placeholder="La nouvelle édition des Olympiades de mathématiques se tiendra le 18 février..."
      ></textarea>
      <div id="submit-row">
        <input
          @click.prevent="saveNews"
          id="submit-button"
          type="button"
          value="Sauvegarder"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang='ts'>
  import DataColumn from '@/components/dashboard/DataColumn.vue'
  import ContextMenu from '@/components/dashboard/context_menu/ContextMenu.vue'
  import ContextMenuSeparator from '@/components/dashboard/context_menu/ContextMenuSeparator.vue'
  import ContextMenuElement from '@/components/dashboard/context_menu/ContextMenuElement.vue'
  import { databaseClient } from '@/database/implementation'
  import type { News } from '@/database/interface/news'
  import { DataSection } from '@/utils/data_section'
  import { computed, ref } from 'vue'
  import type { Ref } from 'vue'
  import { Level } from '@/database/interface/level'
  import { LongDate } from '@/utils/long_date'
  import { MessageType } from '@/utils/message_type'

  const NEWS_BATCH_SIZE = 20

  const selectedNews: Ref<News | null> = ref(null)
  const levels = Level.LEVELS

  const message = ref("")
  const messageClass = ref(MessageType.INDICATION)

  const news = computed(
      () => DataSection.makeSections(
          databaseClient.fetchedNews.value,
          (news) => news.visible ? 'Visibles' : 'Brouillons',
          (section) => ['Visibles', 'Brouillons'].indexOf(section.name)
      )
  )

  // An array with true or false according to the level is concerned
  function isConcerned(level: Level) {
      return selectedNews.value!.concerned.includes(level)
  }

  function setConcerned(level: Level) {
    selectedNews.value!.concerned.push(level)
  }

  async function addNews() {
    const title = prompt('Titre')
    if (title) {
      const news = await databaseClient.createEmptyNews(title)
      selectedNews.value = news
    }
  }

  function selectNews(news: News) {
    selectedNews.value = news
  }

  function newsToText(news: News) {
    return news.title
  }

  function newsToKey(news: News) {
    return news.id
  }

  function setDate(value: any) {
    selectedNews.value!.date = LongDate.fromForm(value.srcElement.value)
  }

  async function saveNews(event: MouseEvent) {
    message.value = 'Actualité en cours de sauvegarde'
    messageClass.value = MessageType.INDICATION

    const error = await databaseClient.updateNews(selectedNews.value!)

    if (error) {
      message.value = error
      messageClass.value = MessageType.ERROR
    } else {
      message.value = "L'actualité a été sauvegardée avec succès"
      messageClass.value = MessageType.GOOD
    }

    setTimeout(() => (message.value = ''), 2000)
  }

  function switchVisibilityOfHistoryPoint(news: News) {
    databaseClient.switchVisibilityOfHistoryPoint(news)
  }

  function deleteNews(news: News) {
    if (confirm('Etes-vous sûr de vouloir supprimer cette actualité ?')) {
      databaseClient.deleteNews(news)
      selectedNews.value = null
    }
  }

  databaseClient.fetchNews(NEWS_BATCH_SIZE, false)
</script>

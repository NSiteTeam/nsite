<script setup lang="ts">
import { databaseClient } from '@/database/implementation'
import { LongDate } from '@/utils/long_date'
import { ref } from 'vue'
import type { Ref } from 'vue'

const { message } = defineProps(['message'])
const editMode: Ref<boolean> = ref(false)
const username: Ref<string> = ref('anonyme')

if (message.author != null) {
  await databaseClient.getUsername(message.author).then((res) => {
    username.value = res
  })
} else {
  username.value = 'anonyme'
}

function formatDate(ISOdate: string) {
  return LongDate.ISOStringToLongDate(ISOdate).beautify()
}

function changeEditMode(cancel: boolean = false) {
  editMode.value = !editMode.value

  // If value goes from true to false and the cancel parameter is false, perform changes
  if (!(editMode.value && cancel)) {
    databaseClient.editMessage(message.id, message.content)
  }
}

function handleDeleteOrCancel() {
  console.log(editMode.value)
  if (editMode.value) {
    changeEditMode(true)
  } else {
    databaseClient.deleteMessage(message.id)
  }
}
</script>

<template>
  <div></div>
  <div class="message">
    <p class="author">
      {{ username }}
    </p>
    <p class="date">{{ formatDate(message.date) }}</p>
    <input
      autocomplete="off"
      class="message-edition-input"
      v-if="editMode"
      v-model="message.content"
      type="text"
    />
    <p class="content" v-else>{{ message.content }}</p>
    <div
      v-if="
        username == databaseClient.user.value.username || message.author == null
      "
      class="messageButtons"
    >
      <button @click="changeEditMode()" class="message-button">
        {{ editMode ? 'Valider' : 'Modifier' }}
      </button>
      <button @click="handleDeleteOrCancel()" class="message-button">
        {{ editMode ? 'Annuler' : 'Supprimer' }}
      </button>
    </div>
  </div>
</template>

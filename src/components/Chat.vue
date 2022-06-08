<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import type Message from '@/database/interface/message'
import { databaseClient } from '@/database/implementation'
import { LongDate }from '@/utils/long_date'
// @ts-ignore bug de vue
import ChatMessage from '@/components/ChatMessage.vue'
import type { Username } from '@/database/interface/username'

interface EditModeState {
    messageId: number
    editMode: boolean
}

const messages: Ref<Message[]> = ref([])
const chatContent: Ref<string> = ref("")
const editMode: Ref<EditModeState[]> = ref([])
const { depoId } = defineProps(['depoId'])
databaseClient.watchMessages(depoId)

databaseClient.fetchMessages(depoId).then((res) => {
    databaseClient.fetchedMessages.value = res.sort((a, b) => 
    Date.parse(b.date) - Date.parse(a.date))
})

function addMessage(message: string) {
    // Verifies if the user is well connected
    // if (databaseClient.uuid.value) {
        // Pushes message to the window, but not the database
        const test = messages.value
        databaseClient.postMessage(
            message,
            depoId
        ).catch(error => {
            console.warn(error)
        })
        // Clears the content of the input
        chatContent.value = ""
    }
// }
</script>

<template>
    <div id="repo-chat">
        <div class="conversation">
            <ChatMessage :key="index" :message=message v-for="(message, index) in databaseClient.fetchedMessages.value"  />
        </div>
        <input id="chatInputBox" type="text" 
        placeholder="Votre message" 
        v-model="chatContent" 
        autocomplete="off"
        v-on:keyup.enter="addMessage(chatContent)">
    </div>
</template>

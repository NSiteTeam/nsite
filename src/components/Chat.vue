<template>
    <div id="repo-chat">
        <div class="conversation">
            <div class="message" 
            v-for="(message, index) in databaseClient.fetchedMessages.value" 
            :key="index" align="right">
                <p class="author">{{ message.author }} </p>
                <p class="date">{{ formatDate(message.date) }}</p>
                <input class="message-edition-input" v-if="getEditModeByMessageId(message.id)"
                v-model="message.content" type="text" :key="index">
                <p class="content" v-else>{{ message.content }}</p>
                <button @click="setEditMode(message.id, !getEditModeByMessageId(message.id), 
                message.content)" class="message-button">Modifier</button>
                <button @click="databaseClient.deleteMessage(message.id)"
                class="message-button">Supprimer</button>
            </div>
        </div>
        <input id="chatInputBox" type="text" 
        placeholder="Votre message" 
        v-model="chatContent" 
        v-on:keyup.enter="addMessage(chatContent)">
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import type Message from '@/database/interface/message'
import { databaseClient } from '@/database/implementation'
import CustomDate from '@/utils/classes/CustomDate'

interface EditModeState {
    messageId: number
    editMode: boolean
}

const messages: Ref<Message[]> = ref([])
const chatContent: Ref<string> = ref("")
const editMode: Ref<EditModeState[]> = ref([])
const { depoId } = defineProps(['depoId'])
databaseClient.clearFiles()
databaseClient.watchMessages(depoId)

databaseClient.fetchMessages(depoId).then((res) => {
    databaseClient.fetchedMessages.value = res.sort((a, b) => 
    Date.parse(b.date) - Date.parse(a.date))
})

function formatDate(ISOdate: string) {
    return CustomDate.ISOStringToCustomDate(ISOdate).beautify()
}

function getEditModeByMessageId(id: number) {
    const correspondingEditModes = editMode.value.filter(editModeState => {
        return editModeState.messageId == id
    })
    if (correspondingEditModes.length > 0) {
        return correspondingEditModes[0]["editMode"]
    } else {
        return false
    }
}

function setEditMode(messageId: number, newEditMode: boolean, newContent: string) {
    // If the message has been modified sooner, finds the editMode and changes it
    if (editMode.value.map((editMode) => editMode.messageId).includes(messageId)) {
        const matchingEditModeIndex = editMode.value.indexOf(
        editMode.value.filter(editModeState => {
            return messageId == editModeState.messageId
        })[0])

        editMode.value[matchingEditModeIndex] = {
            editMode: newEditMode, messageId: messageId
        }

        // If editMode goes from true to false, perform changes
        if (editMode && !newEditMode) {
            databaseClient.editMessage(messageId, newContent)
        }
    }
    // Else simply append it to the array
    else {
        editMode.value.push({ editMode: newEditMode, messageId: messageId })
    }
}

function addMessage(message: string) {
    let uuid = ""
    if (databaseClient.uuid.value == null) {
        uuid = "anonymous"
    } else {
        uuid = databaseClient.uuid.value
    }
    // Verifies if the user is well connected
    // if (databaseClient.uuid.value) {
        // Pushes message to the window, but not the database
        const test = messages.value
        databaseClient.postMessage(
            CustomDate.Now().toISOString(),
            uuid,
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

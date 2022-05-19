<template>
    <div id="repo-chat">
        <div class="conversation">
            <div class="message" i v-for="message in messages" :key="message.content" align="right">
                <p class="author">{{ message.author }}</p>
                <p class="date">{{ formatDate(message.date) }}</p>
                <p class="content">{{ message.content }}</p>
            </div>
        </div>
        <input type="text" 
        placeholder="Votre message" 
        v-model="chatContent" 
        v-on:keyup.enter="addMessage(chatContent)">
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import type Message from '@/database/interface/message'
import SupabaseMessage from '@/database/supabase/supabase_message'
import { databaseClient } from '@/database/implementation'
import CustomDate from '@/utils/classes/CustomDate'

const messages: Ref<Message[]> = ref([])
const chatContent: Ref<string> = ref("")
const props = defineProps(['depoId'])
databaseClient.watchMessages(props.depoId)

databaseClient.fetchMessages(props.depoId).then((res) => {
    messages.value = res.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
})

function formatDate(ISOdate: string) {
    return CustomDate.ISOStringToCustomDate(ISOdate).beautify()
}

function addMessage(message: string) {
    let uuid = ""
    if (databaseClient.uuid.value == null) {
        uuid = "anonyme"
    } else {
        uuid = databaseClient.uuid.value
    }
    // Verifies if the user is well connected
    // if (databaseClient.uuid.value) {
        // Pushes message to the window, but not the database
        const test = messages.value
        messages.value.unshift(new SupabaseMessage(
            message,
            uuid,
            CustomDate.Now().toISOString(),
            props.depoId
        ))
        databaseClient.postMessage(
            CustomDate.Now().toISOString(),
            uuid,
            message,
            props.depoId
        ).catch(error => {
            console.log(error)
        })
        // Clears the content of the input
        chatContent.value = ""
    }
// }
</script>

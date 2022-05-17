<template>
    <div id="repo-chat">
        <div class="conversation">
            <div class="message" i v-for="message in messages" :key="message.content" align="right">
                <p>{{ message.author }}</p>
                <p>{{ formatDate(message.date) }}</p>
                <p>{{ message.content }}</p>
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
console.log(props)

databaseClient.fetchMessages(props.depoId).then((res) => {
    messages.value = res
})

function formatDate(ISOdate: string) {
    return CustomDate.ISOStringToCustomDate(ISOdate).beautify()
}

function addMessage(message: string) {
    // Verifies if the user is well connected
    if (databaseClient.uuid.value) {
        // Pushes message to the window, but not the database
        messages.value.push(new SupabaseMessage(
            message,
            databaseClient.uuid.value,
            CustomDate.Now(),
            Math.random() * 100000
        ))
        // Clears the content of the input
        chatContent.value = ""
    }
}
</script>

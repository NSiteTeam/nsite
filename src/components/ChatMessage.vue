<script setup lang="ts">
import { databaseClient } from "@/database/implementation"
import CustomDate from "@/utils/classes/CustomDate"
import { Ref, ref } from "vue";

const { message } = defineProps(['message'])
const editMode: Ref<boolean> = ref(false)

function formatDate(ISOdate: string) {
    return CustomDate.ISOStringToCustomDate(ISOdate).beautify()
}

function changeEditMode() {
    editMode.value = !editMode.value
}
</script>

<template>
    <div></div>
    <div class="message">
        <!-- <p class="author">
            {{ uuidToUsername(message.author) }}
        </p> -->
        <p class="date">{{ formatDate(message.date) }}</p>
        <!-- <input class="message-edition-input" v-if="getEditModeByMessageId(message.id)"
        v-model="message.content" type="text" :key="index"> -->
        <p class="content">{{ message.content }}</p>
        <div v-if="message.author == databaseClient.uuid.value || message.author == null" 
        class="messageButtons">
            <button @click="changeEditMode()" class="message-button">
                {{ editMode ? "Valider" : "Modifier" }}
            </button>
            <button @click="databaseClient.deleteMessage(message.id)"
            class="message-button">Supprimer</button>
        </div>
        {{ message }}
    </div>
</template>
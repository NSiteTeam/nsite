<script setup lang="ts">
    import { databaseClient } from "@/database/implementation"

    const { message } = defineProps(['message'])
</script>

<template>
    <div></div>
    <!-- <div class="message">
        <p class="author">
            {{ uuidToUsername(message.author) }}
        </p>
        <p class="date">{{ formatDate(message.date) }}</p>
        <input class="message-edition-input" v-if="getEditModeByMessageId(message.id)"
        v-model="message.content" type="text" :key="index">
        <p class="content" v-else>{{ message.content }}</p>
        <div v-if="message.author == databaseClient.uuid.value || message.author == null" 
        class="messageButtons">
            <button @click="setEditMode(message.id, !getEditModeByMessageId(message.id), 
            message.content)" class="message-button">
                {{ getEditModeByMessageId(message.id) ? "Valider" : "Modifier" }}
            </button>
            <button @click="databaseClient.deleteMessage(message.id)"
            class="message-button">Supprimer</button>
        </div>
        {{ message }}
    </div> -->
</template>
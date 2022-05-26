<script setup lang="ts">
import { databaseClient } from "@/database/implementation";
import { ref } from "vue"
import type { Ref } from "vue"

const loggedOut: Ref<string> = ref("Déconnexion")
databaseClient.logout().then((message: string) => {
    databaseClient.isConnected.value = false
    loggedOut.value = message
}).catch((message: string) => {
    loggedOut.value = message
    console.warn("Error while logging out,", message)
})
</script>

<template>
    <div class="disconnected-box">
        <p>{{ loggedOut }}</p>
    </div>
</template>
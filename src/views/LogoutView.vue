<script setup lang="ts">
import { databaseClient } from "@/database/implementation";
import { ref } from "vue"
import type { Ref } from "vue"

const logedOut: Ref<string> = ref("Logging out")
databaseClient.logout().then((message: string) => {
    logedOut.value = message
}).catch((message: string) => {
    logedOut.value = message
    console.warn("Error while logging out,", message)
})
</script>

<template>
    <div class="disconnected-box">
        <p>{{ logedOut }}</p>
    </div>
</template>
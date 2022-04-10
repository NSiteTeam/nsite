<template>
    <form @submit.prevent="handleLogin">
        <input
            type="email"
            v-model="email"
        />
        <input
            type="password"
            v-model="password"
        />
        <input
          type="submit"
          value="Se connecter"
          :disabled="loading"
        />
    </form>
</template>

<script setup>
    import { ref } from "vue"
    import { databaseClient } from '../database/implementation'

    const email = ref("")
    const password = ref("")
    const loading = ref(false)

    async function handleLogin() {
        loading.value = true
        const result = await databaseClient.login(email.value, password.value)
        loading.value = false

        // TODO: Say to the user if connection worked or not
    }
</script>

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
          value="S'inscrire"
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
        const result = await databaseClient.signIn(email.value, password.value)
        loading.value = false

        // TODO: Ask to the user to verify his email
    }
</script>

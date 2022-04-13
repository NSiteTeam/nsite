<template>
    <div class="login-container">
        <form id="register" @submit.prevent="handleLogin">
            <h2>S'inscrire</h2>
            <input
                type="email"
                v-model="email"
                placeholder="Email"
            />
            <input
                type="password"
                v-model="password"
                placeholder="Mot de passe"
            />
            <input
            type="submit"
            value="S'inscrire"
            :disabled="loading"
            />
        </form>
    </div>
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

<template>
    <div class="login-container">
        <form id="login" @submit.prevent="handleLogin">
            <!-- {{ databaseClient.isConnected.value }} -->

            <div v-if="databaseClient.isConnected.value">
                <div class="connected">
                    Vous êtes bien connecté !
                </div>
            </div>
            <div v-else>
                <h2>Se connecter</h2>
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
                value="Se connecter"
                :disabled="loading"
                />
            </div>
            
        </form>
    </div>
</template>

<script setup lang="ts">
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

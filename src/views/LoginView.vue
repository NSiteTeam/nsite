<template>
    <div class="login-container">
        <form id="login" @submit.prevent="handleLogin">
            <div class="good" v-if="!loading && databaseClient.isConnected.value && !failure">
                Vous êtes bien connecté !
            </div>
            <div v-else-if="!loading && failure && !databaseClient.isConnected.value" class="error">
                {{ failure.message }}
            </div>
            <div class="indication" v-else-if="loading">
                Tentative de connection ...
            </div>
            <div class="login-form">
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
    const failure = ref(null)

    const errorMessages = {
        "Request Failed": `Impossible de joindre nos serveurs d'authentification. Vérifiez votre connection internet.`,
        "Invalid login credentials": `Le mot de passe ou l'adresse mail indiquée est erronée.`,
        "Email not confirmed": "Confirmez votre adresse email"
    }

    async function handleLogin() {
        loading.value = true
        const { connectionStatus, error } = await databaseClient.login(email.value, password.value)
        loading.value = false
        failure.value = error

        console.log("État de la connection :", connectionStatus,
        connectionStatus ? "OK" : "\nErreur : " + error.message)
    }
</script>

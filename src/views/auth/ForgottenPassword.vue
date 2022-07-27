<template>
  <div v-if="success" class="good">Un lien de récupération vous a été envoyé</div>
  <div v-else-if="loading" class="indication">Envoi du lien en cours</div>
  <div v-else-if="error" class="error">
    Une erreur s'est produite, vérifiez l' adresse email que vous avez entrée
  </div>
  <div class="forgotten-password-container">
    <div class="headline">
      <RouterLink to="/login" class="backButton">
        <div class="material-icons">arrow_back_ios</div>
      </RouterLink>
      <h1>Mot de passe oublié ?</h1>
    </div>
    <form @submit.prevent="handleSubmit()">
      <label for="email-input">Votre adresse email</label>
      <input v-model="email" type="text" name="email" placeholder="Email" />
      <input type="submit" value="Envoyer" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { databaseClient } from '@/database/implementation'

const email = ref('')

const success = ref(false)
const loading = ref(false)
const error = ref(false)

async function handleSubmit() {
  loading.value = true
  if (await databaseClient.recoverPassword(email.value)) {
    loading.value = false
    success.value = true
  } else {
    loading.value = false
    error.value = true
  }
  setTimeout(() => [success.value, error.value] = [false, false], 3000)
}
</script>

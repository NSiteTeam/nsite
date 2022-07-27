<template>
  <div class="reset-password-form">
    <div v-if="loading" class="indication">Le mot de passe est en cours de modification</div>
    <div v-else-if="success" class="good">Le mot de passe a bien été modifié</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <h1>Changez votre mot de passe</h1>
    <form @submit.prevent="handleSubmit()">
      <label for="password1">Tappez votre nouveau mot de passe</label>
      <PasswordInput
        type="password"
        name="password"
        id="password1"
        v-model="password1"
      />
      <label for="password1"
        >Tappez votre nouveau mot de passe encore une fois</label
      >
      <input
        placeholder="Répétez le mot de passe"
        type="password"
        name="password"
        id="password2"
        v-model="password2"
      />
      <input type="submit" value="Envoyer" />
    </form>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import PasswordInput from '../../components/PasswordInput.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { databaseClient } from '@/database/implementation'
import getParams from '@/utils/get_fragment_parameters'

const route = useRoute()
const type = getParams('type')
const token = getParams('access_token')

const loading = ref(false)
const success = ref(false)
const error = ref('')

const password1 = ref('')
const password2 = ref('')

async function handleSubmit() {
  if (type == 'recovery' && token && password1.value == password2.value) {
    loading.value = true
    if (await databaseClient.changePasswordUsingToken(token, password1.value)) {
      loading.value = false
      success.value = true
    } else {
      loading.value = false
      error.value = "Une erreur s'est produite"
    }
    setTimeout(() => ([success.value, error.value] = [false, '']), 3000)
  } else if (password1.value != password2.value) {
    error.value = 'Les mots de passe ne correspondent pas'
  }
}
</script>

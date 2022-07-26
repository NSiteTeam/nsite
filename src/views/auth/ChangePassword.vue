<template>
  <div v-if="success" class="good">Le mot de passe a bien été changé</div>
  <div v-else-if="loading" class="indication">
    Changement en cours ...
  </div>
  <div v-else-if="error" class="error">Mauvais mot de passe</div>

  <div class="manage-password">
    <div class="label">Changez votre mot de passe :</div>
    <form @submit.prevent="handleSubmit()">
      <label for="oldPassword">Ancien mot de passe :</label>
      <input
        type="password"
        v-model="oldPassword"
        id="oldPassword"
        placeholder="Ancien mot de passe"
      />
      <label for="oldPassword">Nouveau mot de passe</label>
      <PasswordInput
        type="password"
        v-model="newPassword"
        id="newPassword"
        placeholder="Nouveau mot de passe"
      />
      <input type="submit" value="Changer de mot de passe" />
    </form>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import PasswordInput from '../../components/PasswordInput.vue'
import { databaseClient } from '@/database/implementation'
import { ref } from 'vue'

const oldPassword = ref('')
const newPassword = ref('')

const success = ref(false)
const loading = ref(false)
const error = ref(false)

async function handleSubmit() {
  loading.value = true
  if (
    await databaseClient.changePassword(oldPassword.value, newPassword.value)
  ) {
    console.log("Le mot de passe a bien été changé")
    success.value = true
    loading.value = false
  } else {
    console.log("Mauvais mot de passe")
    error.value = true
    loading.value = false
  }
  setTimeout(() => ([success.value, error.value] = [false, false]), 2000)
}
</script>

<template>
  <div class="login-container">
    <form id="register" @submit.prevent="handleRegister">
      <div class="good" v-if="!loading && success && !failure">
        Vérifiez votre adresse email pour vous connecter
      </div>
      <div v-else-if="!loading && failure && !success" class="error">
        {{ errorMessages[failure.message] }}
      </div>
      <div class="indication" v-else-if="loading">
        Tentative de connection ...
      </div>
      <h2>S'inscrire</h2>
      <span class="input-box">
        <input
          type="username"
          v-model="username"
          placeholder="Nom d'utilisateur"
        />
      </span>
      <span class="input-box">
        <input type="email" v-model="email" placeholder="Email" />
      </span>
      <PasswordInput v-model="password" v-model:passwordStrength="passwordStrength" />
      <div class="password-strength-info">
        Le mot de passe doit contenir:
        <ul>
          <li>Au moins une lettre majuscule et minuscule</li>
          <li>Un caractère spécial</li>
          <li>8 caractères ou plus</li>
        </ul>
      </div>
      <input type="submit" value="S'inscrire" :disabled="loading" />
    </form>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import PasswordInput from '@/components/PasswordInput.vue'
import { ref } from 'vue'
import type { Ref } from 'vue'
import { databaseClient } from '@/database/implementation'
import { useRouter } from 'vue-router'

enum strengthLevels {
  UNKNOWN,
  WEAK,
  MEDIUM,
  STRONG,
}

const router = useRouter()
const strengthLevelsNames = ['', 'faible', 'correct', 'fort']

const passwordStrength: Ref<strengthLevels> = ref(strengthLevels.UNKNOWN)
const email: Ref<string> = ref('')
const password: Ref<string> = ref('')
const username: Ref<string> = ref('')
const displayPassword = ref(false)
const loading: Ref<boolean> = ref(false)
const failure = ref()
const success: Ref<boolean> = ref(false)

const errorMessages = {
  'Request Failed': `Impossible de joindre nos serveurs d'authentification. Vérifiez votre connection internet.`,
  'Mot de passe trop faible': `Mot de passe trop faible`,
  'User already registered': "L'utilisateur a déjà été inscrit",
  "Nom d'utilisateur trop court": "Nom d'utilisateur trop court",
  'insert or update on table "profiles" violates foreign key constraint "profiles_user_fkey"':
    'Email déjà utlisé',
  'duplicate key value violates unique constraint "profiles_pkey':
    "Nom d'utilisateur déjà utlisé",
  'duplicate key value violates unique constraint': 'Email déjà utlisé',
}

async function handleRegister() {
  if (passwordStrength.value < 2) {
    failure.value = { message: 'Mot de passe trop faible' }
    return
  }
  loading.value = true
  console.log(username.value)

  const { error, accountCreated } = await databaseClient.signIn(
    email.value,
    password.value,
    username.value,
  )
  if (accountCreated) {
    router.push({ path: '/verify-otp' })
  }
  loading.value = false
  failure.value = error
  success.value = accountCreated
}
</script>

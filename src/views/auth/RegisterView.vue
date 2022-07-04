<template>
  <div class="login-container">
    <form id="register" @submit.prevent="handleRegister">
      <div class="good" v-if="!loading && success && !failure">
        Vérifiez votre adresse email pour vous connecter
      </div>
      <div v-else-if="!loading && failure && !success" class="error">
        {{ failure.message }}
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
      <span class="input-box">
        <input
          :type="displayPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="Mot de passe"
          @input="calculateStrength()"
        />
        <span class="material-icons" @click="togglePassword()">
          visibility{{ displayPassword ? '' : '_off' }}
        </span>
        <div class="strength-bar">
          <span
            class="strength-bar-level"
            :class="passwordStrength > 0 ? 'active color' + passwordStrength : ''"
          ></span>
          <span
            class="strength-bar-level"
            :class="passwordStrength > 1 ? 'active color' + passwordStrength : ''"
            :style="'color:' + strengthColor"
          ></span>
          <span
            class="strength-bar-level"
            :class="passwordStrength > 2 ? 'active color' + passwordStrength : ''"
            :style="'color: ' + strengthColor"
          ></span>
        </div>
      </span>
      <input type="submit" value="S'inscrire" :disabled="loading" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import { databaseClient } from '@/database/implementation'

// Strength checks RegExp
const strongPassword = new RegExp(
  '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})',
)
const mediumPassword = new RegExp(
  '((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))',
)

enum strengthLevels {
  UNKNOWN,
  WEAK,
  MEDIUM,
  STRONG,
}

const strengthLevelsNames = [
  '',
  'Faible',
  'Correct',
  'Fort'
]

const email: Ref<string> = ref('')
const password: Ref<string> = ref('')
const username: Ref<string> = ref('')
const displayPassword = ref(false)
const passwordStrength: Ref<strengthLevels> = ref(strengthLevels.UNKNOWN)
const loading: Ref<boolean> = ref(false)
const failure: Ref<boolean> = ref(false)
const success: Ref<boolean> = ref(false)

function calculateStrength(): void {
  if (strongPassword.test(password.value)) {
    passwordStrength.value = strengthLevels.STRONG
  } else if (mediumPassword.test(password.value)) {
    passwordStrength.value = strengthLevels.MEDIUM
  } else if (password.value.length == 0) {
    passwordStrength.value = strengthLevels.UNKNOWN
  } else {
    passwordStrength.value = strengthLevels.WEAK
  }
}

function togglePassword() {
  displayPassword.value = !displayPassword.value
}

const errorMessages = {
  'Request Failed': `Impossible de joindre nos serveurs d'authentification. Vérifiez votre connection internet.`,
  'Password should be at least 6 characters': `Le mot de passe doit contenir au moins 6 caractères`,
  'User already registered': "L'utilisateur a déjà été inscrit",
  "Nom d'utilisateur trop court": "Nom d'utilisateur trop court",
}

async function handleRegister() {
  loading.value = true
  console.log(username.value)
  const { error, accountCreated } = await databaseClient.signIn(
    email.value,
    password.value,
    username.value,
  )
  loading.value = false
  failure.value = error
  success.value = accountCreated

  // TODO: Ask to the user to verify his email
}
</script>

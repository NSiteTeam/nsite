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
      <span class="input-box password">
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
            :class="
              passwordStrength > 0 ? 'active color' + passwordStrength : ''
            "
          ></span>
          <span
            class="strength-bar-level"
            :class="
              passwordStrength > 1 ? 'active color' + passwordStrength : ''
            "
          ></span>
          <span
            class="strength-bar-level"
            :class="
              passwordStrength > 2 ? 'active color' + passwordStrength : ''
            "
          ></span>
        </div>
        <span v-if="passwordStrength > 0">Mot de passe </span>
        <span class="strength-message" :class="'text-color' + passwordStrength">
          {{ strengthLevelsNames[passwordStrength] }}
        </span>
      </span>
      <div class="password-strength-info">
        Pour être fort, le mot de passe doit :
        <ul>
          <li>Contenir au moins une lettre majuscule et minuscule</li>
          <li>Contenir un caractère spécial</li>
          <li>Avoir une longueur de 8 caractères ou plus</li>
        </ul>
      </div>
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
  '^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z].*[a-z]).{8,}$',
)
const mediumPassword = new RegExp(
  '((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))|((?=.*[a-z])(?=.*[A-Z])(?=.{10,}))',
)

enum strengthLevels {
  UNKNOWN,
  WEAK,
  MEDIUM,
  STRONG,
}

const strengthLevelsNames = ['', 'Faible', 'Correct', 'Fort']

const email: Ref<string> = ref('')
const password: Ref<string> = ref('')
const username: Ref<string> = ref('')
const displayPassword = ref(false)
const passwordStrength: Ref<strengthLevels> = ref(strengthLevels.UNKNOWN)
const loading: Ref<boolean> = ref(false)
const failure = ref()
const success: Ref<boolean> = ref(false)

function calculateStrength(): void {
  // If the password validates the strong password regex, set the password strength to STRONG (=3)
  if (strongPassword.test(password.value)) {
    passwordStrength.value = strengthLevels.STRONG
    // Else if the password validates the strong password regex, set the password strength to STRONG (=2)
  } else if (mediumPassword.test(password.value)) {
    passwordStrength.value = strengthLevels.MEDIUM
    // Else if there is no password, set the password strength to UNKNOWN (=0)
  } else if (password.value.length == 0) {
    passwordStrength.value = strengthLevels.UNKNOWN
  } else {
    // If the password is neither inexistent, medium nor strong, set its strong to WEAK (=1)
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
  loading.value = false
  failure.value = error
  success.value = accountCreated
}
</script>

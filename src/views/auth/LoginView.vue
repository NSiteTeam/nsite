<template>
  <AuthView>
    <form @submit.prevent="tryLogin" class="h-full w-full">
      <div class="flex h-full flex-col">
        <LargeTitle>Se connecter</LargeTitle>

        <InputField
          class="mt-4"
          type="email"
          label="Adresse email"
          placeholder="jean.dupont@gmail.com"
          v-model="email"
          :error="emailError"
        />

        <InputField
          class="mt-4"
          type="password"
          label="Mot de passe"
          v-model="password"
          :error="passwordError"
          placeholder="********"
          @enter="tryLogin"
        />

        <RouterLink
          to="/reset-password"
          class="mt-2 ml-2 cursor-pointer text-xs italic text-blue-700 active:underline"
        >
          Mot de passe oublié ?
        </RouterLink>

        <SubmitButton
          message="Continuer"
          :invalidFields="invalidFields"
          :submitting="submitting"
        />
      </div>
    </form>
  </AuthView>
</template>

<script setup lang="ts">
/**
 * TODO: Allow user to reset its password.
 */
import { computed, ref, watch } from 'vue'
import { databaseClient } from '@/database/implementation'
import { RouterLink } from 'vue-router'
import LargeTitle from '@/components/style/LargeTitle.vue'
import InputField from '@/components/style/InputField.vue'
import AuthView from './AuthView.vue'
import SubmitButton from '@/components/style/SubmitButton.vue'
import { isEmail } from '@/utils/misc_utils'
import {
  MessageReplacer,
  MessageStack,
  MessageType,
} from '@/views/messages/message_stack'
import type { Message } from '@/views/messages/message_stack'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')

const emailError = ref('')
const passwordError = ref('')

const submitting = ref(false)

const replacer = new MessageReplacer()

if (databaseClient.isConnected.value) {
  goHome()
}

watch(email, (value) => {
  if (value && !isEmail(value)) {
    emailError.value = "Cette adresse email n'est pas valide"
  } else {
    emailError.value = ''
  }
})

watch(password, (value) => {
  if (value && value.length < 6) {
    passwordError.value = 'Le mot de passe doit contenir au moins 6 caractères'
  } else {
    passwordError.value = ''
  }
})

const invalidFields = computed(() => {
  return (
    email.value == '' ||
    password.value == '' ||
    emailError.value != '' ||
    passwordError.value != ''
  )
})

async function tryLogin() {
  console.log('Try to login')

  // We remove the last message
  replacer.replaceLastBy({
    type: MessageType.INFO,
    text: 'Connexion en cours...',
    timeout: 5000,
  })

  submitting.value = true

  await databaseClient
    .login(email.value, password.value)
    .then(() => {
      replacer.replaceLastBy({
        type: MessageType.SUCCESS,
        text: 'Connexion réussie',
        timeout: 2000,
      })

      email.value = ''
      password.value = ''

      goHome()
    })
    .catch((error) => {
      replacer.replaceLastBy({
        type: MessageType.ERROR,
        text: tryTranslate(error),
        timeout: 5000,
      })
    })
    .finally(() => {
      submitting.value = false
    })
}

function goHome() {
  router.push('/')
}

function tryTranslate(englishError: string) {
  switch (englishError) {
    case 'Invalid login credentials':
      return 'Identifiants invalides'
    case 'Email not confirmed':
      return "Votre adresse email n'a pas été confirmée"
    default:
      return englishError
  }
}
</script>

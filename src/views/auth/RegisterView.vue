<template>
  <AuthView>
    <form
      @keydown.enter="tryRegister"
      @submit.prevent="tryRegister"
      class="h-full w-full"
    >
      <div class="flex h-full flex-col">
        <LargeTitle>S'inscrire</LargeTitle>

        <p class="text-sm italic text-gray-500">
          Le compte n'est pas nécessaire pour les utilisateurs n'étant pas
          enseignants.
        </p>

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
        />
        <div class="mt-1 w-full">
          <div
            class="h-2 rounded bg-gradient-to-r transition-all duration-500"
            :class="{
              'w-1/12 from-purple-200 to-purple-700': passwordStrength == 0,
              'w-1/6 from-red-200 to-red-700': passwordStrength == 1,
              'w-2/6 from-orange-200 to-orange-700': passwordStrength == 2,
              'w-3/6 from-yellow-200 to-yellow-700': passwordStrength == 3,
              'w-4/6 from-amber-200 to-amber-700': passwordStrength == 4,
              'w-5/6 from-green-200 to-green-700': passwordStrength == 5,
              'w-full from-blue-200 to-blue-700': passwordStrength == 6,
            }"
          ></div>
          <span class="text-sm text-gray-600">
            {{ passwordStrengthMessage }}
          </span>
        </div>

        <InputField
          class="mt-4"
          type="password"
          label="Confirmez votre mot de passe"
          v-model="confirmPassword"
          :error="confirmPasswordError"
          placeholder="********"
        />

        <SubmitButton
          message="S'inscrire"
          :invalidFields="invalidFields"
          :submitting="submitting"
        />
      </div>
    </form>
  </AuthView>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { databaseClient } from '@/database/implementation'
import { evaluatePassword, isEmail } from '@/utils/misc_utils'
import LargeTitle from '@/components/style/LargeTitle.vue'
import InputField from '@/components/style/InputField.vue'
import AuthView from './AuthView.vue'
import SubmitButton from '@/components/style/SubmitButton.vue'
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
const confirmPassword = ref('')

const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

const submitting = ref(false)

const passwordStrength = ref(0)
const strengthMessage = ref('')
const passwordStrengthMessage = ref('')
const tip = ref('')

let replacer = new MessageReplacer()

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

watch(password, displayPasswordEvaluation)
displayPasswordEvaluation()

const invalidFields = computed(() => {
  return (
    email.value == '' ||
    password.value == '' ||
    confirmPassword.value == '' ||
    emailError.value != '' ||
    passwordError.value != '' ||
    confirmPasswordError.value != ''
  )
})

async function tryRegister() {
  console.log('Try to register')

  replacer.replaceLastBy({
    type: MessageType.INFO,
    text: 'Inscription en cours...',
    timeout: 5000,
  })

  submitting.value = true

  await databaseClient
    .register(email.value, password.value)
    .then(() => {
      replacer.replaceLastBy({
        type: MessageType.SUCCESS,
        text: "Inscription réussie, si l'adresse email que vous avez fournie est valide, vous recevrez un email de confirmation pour activer votre compte.", // TODO see supabase.ts.register
        timeout: 10000,
      })

      email.value = ''
      password.value = ''
      confirmPassword.value = ''

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

watch([confirmPassword, password], (values) => {
  if (values[0] != values[1] && values[1] != '') {
    confirmPasswordError.value = 'Les mots de passe ne correspondent pas'
  } else if (passwordError.value != '') {
    confirmPasswordError.value = 'Votre mot de passe doit être sûr'
  } else {
    confirmPasswordError.value = ''
  }
})

function displayPasswordEvaluation() {
  ;[passwordStrength.value, strengthMessage.value, tip.value] =
    evaluatePassword(password.value)

  if (passwordStrength.value < 5 && password.value) {
    passwordError.value = ' ' // Little hack to make the error border pop out
    if (confirmPasswordError.value == '') {
      confirmPasswordError.value = 'Votre mot de passe doit être sûr'
    }
  } else {
    passwordError.value = ''
  }

  if (passwordStrength.value == 5) {
    tip.value = 'Votre mot de passe est sûr.'
  } else if (passwordStrength.value == 6) {
    tip.value = 'Votre mot de passe est extrêmement sécurisé.'
  }

  passwordStrengthMessage.value = `${strengthMessage.value} ${tip.value}`
}

function goHome() {
  router.push('/')
}

function tryTranslate(englishError: string) {
  switch (englishError) {
    case 'Invalid login credentials':
      return 'Identifiants invalides'
    default:
      return englishError
  }
}
</script>

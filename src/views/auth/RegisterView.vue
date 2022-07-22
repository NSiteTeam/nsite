<template>
  <AuthView>
    <form @submit.prevent="tryRegister" class="h-full w-full">
      <div class="flex flex-col h-full">
        <LargeTitle>S'inscrire</LargeTitle>

        <p class='text-sm text-gray-500 italic'>
          Le compte n'est pas nécessaire pour les utilisateurs n'étant pas enseignants.
        </p>

        <InputField
          class='mt-4'
          type="email"
          label="Adresse email"
          placeholder="jean.dupont@gmail.com"
          v-model='email'
          :error='emailError'
        />

        <InputField
          class='mt-4'
          type="password"
          label="Mot de passe"
          v-model="password"
          :error='passwordError'
          placeholder="********"
        />
        <div class="w-full mt-1">
          <div
            class='h-2 rounded bg-gradient-to-r transition-all duration-500'
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
          class='mt-4'
          type="password"
          label="Confirmez votre mot de passe"
          v-model="confirmPassword"
          :error='confirmPasswordError'
          placeholder="********"
        />

        <SubmitButton
          message="S'inscrire"
          :invalidFields='invalidFields'
          :submitting='submitting'
        />
      </div>
    </form>
  </AuthView>
</template>

<script setup lang="ts">
  /**
   * TODO: 1. Go to a "waiting for email confirmation" page
   *       2. Password confirmation
   */
  import { computed, ref, watch } from 'vue'
  import { databaseClient } from '@/database/implementation'
  import LargeTitle from '@/components/style/LargeTitle.vue'
  import InputField from '@/components/style/InputField.vue'
  import AuthView from './AuthView.vue'
  import SubmitButton from '@/components/style/SubmitButton.vue'
  import { MessageReplacer, MessageStack, MessageType } from '@/utils/message_stack'
  import type { Message } from '@/utils/message_stack'
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
  const passwordStrengthMessage = ref('')

  let replacer = new MessageReplacer()

  if (databaseClient.isConnected.value) {
    goHome()
  }

  watch(email, (value) => {
    if (value && !isEmail(value)) {
      emailError.value = 'Cette adresse email n\'est pas valide'
    } else {
      emailError.value = ''
    }
  })

  watch(password, (value) => {
    evaluatePassword(value)
  })
  evaluatePassword(password.value)

  const invalidFields = computed(() => {
    return email.value == '' ||
      password.value == '' ||
      confirmPassword.value == '' ||
      emailError.value != '' ||
      passwordError.value != '' ||
      confirmPasswordError.value != ''
  })

  async function tryRegister() {
    console.log("Try to register")

    replacer.replaceLastBy({
      type: MessageType.INFO,
      text: 'Inscription en cours...',
      timeout: 5000
    })

    submitting.value = true

    await databaseClient.register(email.value, password.value)
      .then(() => {
        replacer.replaceLastBy({
          type: MessageType.SUCCESS,
          text: 'Inscription réussie, si l\'adresse email que vous avez fournie est valide, vous recevrez un email de confirmation pour activer votre compte.', // TODO see supabase.ts.register
          timeout: 10000
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
          timeout: 5000
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

  // Thanks to https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
  function isEmail(email: string) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  function evaluatePassword(value: string) {let strength = 0
    let tip = ''

    if (value.length >= 6) {
      strength += 1
    } else if (!tip) {
      tip = 'Le mot de passe doit contenir au moins 6 caractères.'
    }

    if (value.match(/[a-z]/)) {
      strength += 1
    } else if (!tip) {
      tip = 'Le mot de passe doit contenir au moins une lettre minuscule.'
    }

    if (value.match(/[A-Z]/)) {
      strength += 1
    } else if (!tip) {
      tip = 'Le mot de passe doit contenir au moins une lettre majuscule.'
    }

    if (value.match(/[0-9]/)) {
      strength += 1
    } else if (!tip) {
      tip = 'Le mot de passe doit contenir au moins un chiffre.'
    }

    if (value.match(/[^a-zA-Z0-9]/)) {
      strength += 1
    } else if (!tip) {
      tip = 'Le mot de passe doit contenir au moins un caractère spécial.'
    }

    if (value.length > 12) {
      strength += 1
    }

    passwordStrength.value = strength

    let strengthMessage = null
    switch (strength) {
      case 0:
        strengthMessage = '😕 Très faible.'
        break
      case 1:
        strengthMessage = '😑 Faible.'
        break
      case 2:
        strengthMessage = '😐 Moyen.'
        break
      case 3:
        strengthMessage = '😊 Bon.'
        break
      case 4:
        strengthMessage = '🙂 Très bon.'
        break
      case 5:
        strengthMessage = '😁 Excellent.'
        break
      case 6:
        strengthMessage = '🤩 Wow.'
        break
    }

    if (strength < 5 && password.value) {
      passwordError.value = ' ' // Little hack to make the error border pop out
      if (confirmPasswordError.value == '') {
        confirmPasswordError.value = 'Votre mot de passe doit être sûr'
      }
    } else {
      passwordError.value = ''
    }

    if (strength == 5) {
      tip = 'Votre mot de passe est sûr.'
    } else if (strength == 6) {
      tip = 'Votre mot de passe est extrêmement sécurisé.'
    }

    passwordStrengthMessage.value = `${strengthMessage} ${tip}`
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

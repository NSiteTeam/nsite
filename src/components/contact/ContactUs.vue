<template>
  <AuthView>
    <form @submit.prevent="tryRegister" class="h-full w-full">
      <div class="flex h-full flex-col">
        <LargeTitle>Nous contacter</LargeTitle>

        <p class="text-sm italic text-gray-500">
          Nous tâcherons de répondre au plus vite!
        </p>

        <InputField
          class="mt-4"
          type="text"
          label="Votre nom"
          placeholder="Jean Dupont"
          v-model="name"
          :error="texterror"
        />

        <InputField
          class="mt-4"
          type="email"
          label="Adresse mail"
          v-model="email"
          :error="emailError"
          placeholder="exemple.test@votremail.com"
        />

        <TextArea
          class="block h-64 w-full"
          label="Votre message"
          placeholder="Tapez votre message ici..."
          id="message"
          v-model="message"
        />

        <SubmitButton
          message="Envoyer"
          :invalidFields="invalidFields"
          :submitting="submitting"
        />
      </div>
    </form>
    <p class="center mt-8 text-sm italic text-gray-500">Ou alors:</p>
    <a
      href="https://discord.gg/4GK7rK4UTC"
      type="button"
      class="ml-16 mt-4 mr-2 mb-2 inline-flex items-center rounded-lg bg-[#050708] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#050708]/90 focus:outline-none focus:ring-4 focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 dark:focus:ring-[#050708]/50"
    >
      <img
        class="mr-2"
        width="32"
        src="../../assets/discord.png"
        alt="logo discord"
      />
      Contactez nous sur discord
    </a>
  </AuthView>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { databaseClient } from '@/database/implementation'
import LargeTitle from '@/components/style/LargeTitle.vue'
import InputField from '@/components/style/InputField.vue'
import AuthView from '../../views/auth/AuthView.vue'
import SubmitButton from '@/components/style/SubmitButton.vue'
import TextArea from '@/components/style/TextArea.vue'
import { isEmail } from '@/utils/misc_utils'
import {
  MessageReplacer,
  MessageStack,
  MessageType,
} from '@/views/messages/message_stack'
import type { Message } from '@/views/messages/message_stack'
import { useRouter } from 'vue-router'

function goHome() {
  router.push('/')
}

const router = useRouter()

const name = ref('')
const email = ref('')
const message = ref('')

const emailError = ref('')

const submitting = ref(false)

let replacer = new MessageReplacer()

watch(email, (value) => {
  if (value && !isEmail(value)) {
    emailError.value = "Cette adresse email n'est pas valide"
  } else {
    emailError.value = ''
  }
})

const invalidFields = computed(() => {
  return email.value == '' || emailError.value != ''
})

async function tryRegister() {
  console.log('Try to send message')

  replacer.replaceLastBy({
    type: MessageType.INFO,
    text: 'Envoie en cours...',
    timeout: 5000,
  })

  submitting.value = true

  await databaseClient
    .RecieveMessage(name.value, email.value, message.value)
    .then(() => {
      replacer.replaceLastBy({
        type: MessageType.SUCCESS,
        text: 'Votre message a correctement été envoyé.',
        timeout: 5000,
      })

      email.value = ''
      name.value = ''
      message.value = ''

      goHome()
    })
    .catch((error) => {
      replacer.replaceLastBy({
        type: MessageType.ERROR,
        text: 'Réésayez plus tard.',
        timeout: 5000,
      })
    })
    .finally(() => {
      submitting.value = false
    })
}
</script>

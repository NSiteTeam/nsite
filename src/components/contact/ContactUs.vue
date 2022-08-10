<template>
  <AuthView>
    <form @submit.prevent="tryRegister" class="h-full w-full">
      <div class="flex flex-col h-full">
        <LargeTitle>Nous contacter</LargeTitle>

        <p class='text-sm text-gray-500 italic'>
          Nous tâcherons de répondre au plus vite!
        </p>

        <InputField
          class='mt-4'
          type="text"
          label="Votre nom"
          placeholder="Jean Dupont"
          v-model='name'
          :error='texterror'
        />

        <InputField
          class='mt-4'
          type="email"
          label="Adresse mail"
          v-model="email"
          :error='emailError'
          placeholder="exemple.test@votremail.com"
        />

        <TextArea
          class="block h-64 w-full"
          label = "Votre message"
          placeholder="Tapez votre message ici..."
          id = "message"
          v-model="message"
        />

        <SubmitButton

          message="Envoyer"
          :invalidFields='invalidFields'
          :submitting='submitting'
        />
      </div>
    </form>
    <p class='text-sm text-gray-500 italic mt-8 center'>Ou alors:</p>
  <a href="https://discord.com/channels/1007042941140861078/1007042941140861081" type="button" class="ml-16 mt-4 text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#050708]/50 dark:hover:bg-[#050708]/30 mr-2 mb-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-discord mr-2" viewBox="0 0 16 16">
  <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
</svg>
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
  import { MessageReplacer, MessageStack, MessageType } from '@/views/messages/message_stack'
  import type { Message } from '@/views/messages/message_stack'
  import { useRouter } from 'vue-router'

  function goHome() {
    router.push('/')
  }

  function isEmail(email: string) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const router = useRouter()

  const name = ref('')
  const email = ref('')
  const message = ref('')

  const emailError = ref('')

  const submitting = ref(false)

  let replacer = new MessageReplacer()

  watch(email, (value) => {
    if (value && !isEmail(value)) {
      emailError.value = 'Cette adresse email n\'est pas valide'
    } else {
      emailError.value = ''
    }
  })

  const invalidFields = computed(() => {
    return email.value == '' ||
      emailError.value != ''
  })

    async function tryRegister() {
    console.log("Try to send message")

    replacer.replaceLastBy({
      type: MessageType.INFO,
      text: 'Envoie en cours...',
      timeout: 5000
    })

    submitting.value = true

    
    await databaseClient.RecieveMessage(name.value, email.value, message.value)
      .then(() => {
        replacer.replaceLastBy({
          type: MessageType.SUCCESS,
          text: 'Votre message a correctement été envoyé.', 
          timeout: 5000
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
        timeout: 5000
      })
    })
    .finally(() => {
      submitting.value = false
    })
  }




</script> 
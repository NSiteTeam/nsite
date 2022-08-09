<!--<template>
  <div class="relative min-h-main py-4">
    <div class="absolute top-0 left-0 h-full w-full -z-10 overflow-clip" >
      <img class="blur-sm object-cover h-full w-full scale-105" src="/src/assets/geometry_image.jpg" />
    </div>
    <div class="center">
      <ShadowBox class="bg-gray-100/90 w-4/5 md:max-w-md">
        <form method="POST" action="https://formsubmit.co/faca456cbe1f8bad5ade51791a947223" class="h-full w-full">
          <input type="text" name="_honey" style="display: none;">
          <input type="hidden" name="_captcha" value="false">
            <div class="flex flex-col h-full">
                <h1 class="text-4xl font-bold my-3 font-sans">Nous contacter</h1>
                <div class="mt-4">
                  <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Votre nom</label>
                    <div class="relative mb-6">
                      <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <svg aria-hidden="true" class="mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"></path></svg>
                      </div>
                      <input type="text" name="name" id="name" class="bg-gray-300 border border-gray-350 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Patrick Dupond" required>
                    </div>
                </div>
                <div class="mt-4">
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Votre E-mail</label>
                        <div class="relative mb-6">
                          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                          </div>
                          <input type="email" name="email" id="email" class="bg-gray-300 border border-gray-350 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="exemple.xyz@mathsmail.com" required>
                        </div>
                </div>
                <div class="mt-4">
                    <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Votre message</label>
                    <textarea id="message" rows="6" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-300 rounded-lg border border-gray-350 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Votre message..." name="message" required></textarea>
                </div>
                 <button type="submit" id="send" class="w-full text-white bg-primary/70 hover:bg-primary/80 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Envoyer votre message</button>
            </div>
        </form>
      </ShadowBox>
    </div>
  </div>
</template>-->

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
          type: MessageType.WELLSEND,
          text: 'Nous vous répondrons dès que possible.', 
          timeout: 5000
        })

        email.value = ''
        name.value = ''
        message.value = ''

        goHome()

    })
    .catch((error) => {
      replacer.replaceLastBy({
        type: MessageType.BADSEND,
        text: 'Réésayez plus tard.',
        timeout: 5000
      })
    })
    .finally(() => {
      submitting.value = false
    })
  }




</script> 
<template>
  <div class="m-8">
    <LargeTitle class="mb-8">
      Quelle adresse avez-vous utilisée pour vous inscrire ?
    </LargeTitle>
    <form
      @keydown.enter.prevent="handleSubmit"
      @submit.prevent="handleSubmit"
      class="flex w-1/2 flex-col rounded-xl border-2 border-primary p-4"
    >
      <SmallTitle>Votre adresse email :</SmallTitle>
      <InputField
        @input="tellEmailValidity"
        v-model="email"
        type="email"
        placeholder="Ex: jean-dupont@example.fr"
        class="w-96"
      />
      <span
        v-if="email"
        class="ml-2"
        :class="{
          'text-red-600': !isEmail(email),
          'text-primary': isEmail(email),
        }"
        >{{ emailValidityMessage }}</span
      >
      <SubmitButton class="mt-2 ml-2 w-32" :invalidFields="!isEmail(email)" />
    </form>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import InputField from '@/components/style/InputField.vue'
// @ts-ignore
import LargeTitle from '@/components/style/LargeTitle.vue'
// @ts-ignore
import SmallTitle from '@/components/style/SmallTitle.vue'
// @ts-ignore
import SubmitButton from '@/components/style/SubmitButton.vue'
import { databaseClient } from '@/database/implementation'
import { isEmail } from '@/utils/misc_utils'
import { ref } from 'vue'
import { MessageStack, MessageType } from '../messages/message_stack'

const email = ref<string>('')
const emailValidityMessage = ref<string>('')
const isEmailValid = ref<boolean | null>(null)

async function handleSubmit() {
  if (!isEmail(email.value)) return

  const error = await databaseClient.sendResetUserPassword(email.value)

  if (error) {
    return MessageStack.getInstance().push({
      text: error,
      type: MessageType.ERROR,
    })
  }

  MessageStack.getInstance().push({
    text: "Si l'adresse que vous avez entrée est correcte, vous allez recevoir un lien pour changer votre mot de passe",
    type: MessageType.SUCCESS,
  })
}

function tellEmailValidity() {
  if (isEmail(email.value)) {
    emailValidityMessage.value = "Format d'email valide"
  } else {
    emailValidityMessage.value = "Format d'email invalide"
  }
}
</script>

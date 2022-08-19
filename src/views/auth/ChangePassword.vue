<template>
  <div class="m-4">
    <MediumTitle> Changez votre mot de passe </MediumTitle>
    <form
      @keydown.enter.prevent="handleSubmit"
      @submit.prevent="handleSubmit"
      class="flex w-1/2 flex-col rounded-xl border-2 border-primary p-4"
    >
      <SmallTitle>Votre nouveau mot de passe :</SmallTitle>
      <InputField
        @keydown.enter.prevent="handleSubmit"
        v-model="password1"
        placeholder="Votre nouveau mot de passe"
        type="password"
        class="w-96"
      />
      <SmallTitle>Répètez-le :</SmallTitle>
      <InputField
        @keydown.enter.prevent="handleSubmit"
        v-model="password2"
        type="password"
        placeholder="Encore votre mot de passe"
        class="w-96"
      />
      <i v-if="password1 != password2" class="ml-2 text-red-500"
        >Les mots de passe ne correspondent pas</i
      >
      <!-- If the passwords do not match or are empty, disable the button -->
      <SubmitButton
        class="mt-2 ml-2 w-32"
        @click="handleSubmit"
        :invalidFields="passwordsIdentical"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import SmallTitle from '@/components/style/SmallTitle.vue'
// @ts-ignore
import InputField from '@/components/style/InputField.vue'
// @ts-ignore
import MediumTitle from '@/components/style/MediumTitle.vue'
// @ts-ignore
import SubmitButton from '@/components/style/SubmitButton.vue'
import { databaseClient } from '@/database/implementation'
import { pushError, pushInfo, pushSuccess } from '../messages/message_stack'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { evaluatePassword } from '@/utils/misc_utils'

const route = useRoute()
const router = useRouter()

const passwordsIdentical = computed(() => {
  return password1.value != password2.value || password1.value == ''
})

const password1 = ref('')
const password2 = ref('')

async function handleSubmit(): Promise<void> {
  if (passwordsIdentical.value)
    return pushError('Les mots de passe sont différents')
  if (evaluatePassword(password1.value)[0] <= 2)
    return pushError('Le mot de passe est trop faible')

  const token = route.params.token as string
  const error = await databaseClient.resetPasswordWithToken(
    token,
    password1.value,
  )

  pushInfo('Mot de passe en cours de modification ...')

  if (error) return pushError(error)
  else pushSuccess('Votre mot de passe a bien été modifié')

  router.push('/')
}
</script>

<template>
  <div v-if="success" class="good">Code bon</div>
  <div v-else-if="loading" class="indication">Vérification en cours</div>
  <div v-else-if="failure" class="error">Mauvais code, réessayez</div>
  <div class="otp">
    <h1>Entrez le code de vérification reçu par mail</h1>
    <Pincode
      @finished="handleFinished"
      :secure="false"
      :material="true"
      :length="6"
      :white="true"
    />
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import Pincode from '@/components/Pincode.vue'
import { databaseClient } from '@/database/implementation'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const success = ref(false)
const loading = ref(false)
const failure = ref(false)

async function handleFinished(code: string) {
  loading.value = true
  const isOtpValid = await databaseClient.checkOTP(code)
  console.log("pas d'erreur:", isOtpValid)

  if (isOtpValid) {
    loading.value = false
    success.value = true
    setTimeout(() => router.push({ path: '/profile' }), 1000)
  } else {
    loading.value = false
    failure.value = true
    setTimeout(() => failure.value = false, 1000)
  }
}
</script>

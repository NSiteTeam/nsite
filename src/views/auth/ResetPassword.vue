<template>
  <div class="m-8">
    <MediumTitle>
      Entrez votre adresse email
    </MediumTitle>
    <InputField
      class="w-96"
    />
    <SubmitButton
      class="ml-4"
    />
  </div>
</template>

<script setup lang="ts">
import InputField from '@/components/style/InputField.vue'
import MediumTitle from '@/components/style/MediumTitle.vue'
import SubmitButton from '@/components/style/SubmitButton.vue'
</script>

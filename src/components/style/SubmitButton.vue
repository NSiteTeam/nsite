<template>
  <input
    class="
      mt-8 cursor-pointer px-4 py-3 rounded-lg transition-colors
     text-lg font-semibold
    "
    :class="{
      'bg-primary text-white': !submitting && !invalidFields,
      'bg-primary/60 text-gray-200': submitting || invalidFields,
      'cursor-wait': submitting
    }"
    type="submit"
    :value='message'
    :disabled='submitting || invalidFields'
  />
</template>

<script setup lang="ts">
  defineProps({
    message: {
      type: String,
      default: 'Continuer'
    },
    invalidFields: {
      type: Boolean,
      default: false,
    },
    submitting: {
      type: Boolean,
      default: false,
    },
  })
</script>
<template>
  <input
    class="
      mt-8 cursor-pointer rounded-lg transition-colors
      text-lg font-semibold
    "
    :class="{
      'px-4 py-3': !small,
      'px-2 py-1': small,
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
    small: {
      type: Boolean,
      default: false,
    },
  })
</script>
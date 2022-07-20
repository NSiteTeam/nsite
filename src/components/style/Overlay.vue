<template>
  <div
    @click='closeOverlay'
    :class="{
      'hidden': !on,
      'fixed top-0 left-0 w-screen h-screen bg-black/20 z-40': on
    }"
  ></div>
</template>

<script setup lang="ts">
  defineProps({
    on: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['close'])

  const closeOverlay = () => {
    emit('close')
  }
</script>

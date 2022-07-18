<template>
  <div
    :class="{
      'hidden': !on,
      'fixed top-0 left-0 w-screen h-screen bg-black/30 z-40': on
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
</script>

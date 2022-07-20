<template>
  <div class="flex my-4 text-xl">
    <span class="cursor-pointer select-none mr-1">{{ smiley }}</span>
    <span class="font-semibold">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    smiley: {
      type: String,
      required: true,
    }
  })
</script>

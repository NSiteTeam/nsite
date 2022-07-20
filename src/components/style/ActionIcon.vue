<template>
  <div
    class="
      hover:bg-gray-300/40 rounded-full w-8 h-8 p-1 center
    "
  >
    <span
      class="material-icons text-2xl text-black select-none cursor-pointer"
    >
      {{ icon }}
    </span>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    icon: {
      type: String,
      required: true,
    }
  })
</script>
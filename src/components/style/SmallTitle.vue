<template>
  <h1 class="text-lg font-bold my-1">
    <slot v-if="!skeleton" />
    <SkeletonText lg v-else />
  </h1>
</template>

<script setup lang="ts">
import SkeletonText from '@/components/style/SkeletonText.vue'

defineProps({
  skeleton: {
    type: Boolean,
    default: false,
  },
  white: {
    type: Boolean,
    default: false
  }
}) 

</script>

<template>
  <h1 class="text-2xl font-bold my-2">
    <slot v-if='!skeleton' />
    <SkeletonText 2xl v-else/>
  </h1>
</template>

<script setup lang='ts'>
  import SkeletonText from '@/components/style/SkeletonText.vue'

  defineProps({
    skeleton: {
      type: Boolean,
      default: false
    }
  })
</script>

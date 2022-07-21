<template>
  <h1 class="text-4xl font-bold my-3 font-sans">
    <slot v-if='!skeleton' />
    <SkeletonText 4xl v-else/>
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

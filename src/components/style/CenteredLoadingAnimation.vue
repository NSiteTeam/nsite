<template>
  <div class="center">
    <LoadingAnimation :size='animationSize'/>
  </div>
</template>

<script setup lang="ts">
  import LoadingAnimation from '@/components/LoadingAnimation.vue'

  defineProps({
    animationSize: {
      type: String,
      default: '75%'
    }
  })
</script>

<template>
  <div class="relative min-h-main py-4">
    <div class="center">
      <ShadowBox class="bg-gray-100/90 w-4/5 md:max-w-md">
        <slot />
      </ShadowBox>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ShadowBox from '@/components/style/ShadowBox.vue'
</script>
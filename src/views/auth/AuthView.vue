<template>
  <div class="relative min-h-main py-4">
    <div class="absolute top-0 left-0 h-full w-full -z-10 overflow-clip" >
      <img class="blur-sm object-cover h-full w-full scale-105" src="/src/assets/geometry_image.jpg" />
    </div>
    <div class="flex justify-center">
      <ShadowBox class="bg-gray-100/90 w-4/5 md:max-w-md">
        <slot />
      </ShadowBox>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ShadowBox from '@/components/style/ShadowBox.vue'
</script>
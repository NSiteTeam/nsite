<template>
  <span
   class='rounded-full bg-gray-300 mx-2'
   :class='{
      "w-2 h-2": !xs,
      "w-1 h-1": xs,
    }'
  ></span>
</template>

<script setup lang='ts'>
  defineProps({
    xs: {
      type: Boolean,
      default: false,
    },
  })
</script>

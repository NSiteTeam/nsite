<template>
  <div
    class="
      shadow-lg rounded-xl border-gray-100 border-2
      p-4 md:p-8
      m-5 lg:m-10
    "
    :class='{
      "transition-all hover:-translate-y-3": reactOnHover,
    }'
  >
    <slot/>
  </div>
</template>

<script setup lang='ts'>
  defineProps({
    reactOnHover: {
      type: Boolean,
      default: false
    }
  })
</script>

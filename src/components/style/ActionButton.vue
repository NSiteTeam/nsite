<template>
  <button
    class="
      cursor-pointer h-min
      rounded-lg
      text-lg font-semibold overflow-x-hidden
    "
    :class='{
      "px-3.5 py-2.5": !small,
      "px-1.5 py-0.5": small,
      "bg-primary text-white border-4 border-primary": primary && !disabled,
      "border-primary border-4 bg-primary/5 text-primary": primaryBorder,
      "bg-red-500 text-white border-4 border-red-500": danger,
      "bg-gray-100 text-gray-600 border-4 border-gray-600": cancel,
      "bg-primary/40 border-4 border-primary/40 text-gray-100": primary && disabled
    }'
  >
    <slot/>
  </button>
</template>

<script setup lang="ts">
  defineProps({
    primary: {
      type: Boolean,
      default: false,
    },
    primaryBorder: {
      type: Boolean,
      default: false,
    },
    danger: {
      type: Boolean,
      default: false,
    },
    cancel: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    }
  })
</script>

<template>
  <button
    class="h-min cursor-pointer overflow-x-hidden rounded-lg text-lg font-semibold"
    :class="{
      'px-3.5 py-2.5': !small,
      'px-1.5 py-0.5': small,
      'border-4 border-primary bg-primary text-white': primary && !disabled,
      'border-4 border-primary bg-primary/5 text-primary': primaryBorder,
      'border-4 border-red-500 bg-red-500 text-white': danger,
      'border-4 border-gray-600 bg-gray-100 text-gray-600': cancel,
      'border-4 border-primary/40 bg-primary/40 text-gray-100':
        primary && disabled,
    }"
  >
    <slot />
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

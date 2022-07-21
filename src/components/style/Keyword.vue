<template>
  <span :class='classes'>
    <slot/>
  </span>
</template>

<script setup lang="ts">
  import { computed } from "vue"

  const props = defineProps({
    primary: {
      type: Boolean,
      default: false
    },
    secondary: {
      type: Boolean,
      default: false
    },
    tertiary: {
      type: Boolean,
      default: false
    },
    bold: {
      type: Boolean,
      default: false
    },
  })

  const classes = computed(() => {
    const classes = []
    if (props.primary) classes.push('text-primary')
    if (props.secondary) classes.push('text-secondary')
    if (props.tertiary) classes.push('text-tertiary')
    if (props.bold) classes.push('font-bold')
    return classes
  })
</script>

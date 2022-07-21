<template>
  <div :class='bg' class="inline-block rounded-full px-2 py-0.5 m-1 text-xs text-white whitespace-nowrap">
    <slot />
  </div>
</template>

<script setup lang='ts'>
  import { computed } from 'vue'

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
    }
  })

  const bg = computed(() => {
    const classes = []
    if (props.primary) classes.push('bg-primary')
    if (props.secondary) classes.push('bg-secondary')
    if (props.tertiary) classes.push('bg-tertiary')
    return classes
  })
</script>

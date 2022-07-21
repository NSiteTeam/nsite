<template>
  <ActionIcon
    icon='expand_less'
    class='transition-transform'
    :class='{
      "-scale-y-100": collapsed
    }'
    :disabled='disabled'
  />
</template>

<script setup lang='ts'>
  import ActionIcon from '@/components/style/ActionIcon.vue'

  defineProps({
    collapsed: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  })
</script>

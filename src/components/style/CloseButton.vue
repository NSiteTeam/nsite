<template>
  <ActionIcon
    :class='side'
    class="absolute m-2 center"
    icon='close'
  >
  </ActionIcon>
</template>

<script setup lang="ts">
  import ActionIcon from '@/components/style/ActionIcon.vue'

  defineProps({
    side: {
      type: String,
      required: true,
    }
  })
</script>

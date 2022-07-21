<template>
  <span class="material-icons select-none" :class='size'>{{ icon }}</span>
</template>

<script setup lang='ts'>
  import { isBase, fontSize , TextSizes } from '@/utils/text_sizes'
  import { computed } from 'vue'

  const props = defineProps({
    ...{
      icon: {
        type: String,
        required: true,
      },
    },
    ...TextSizes,
  })

  const base = computed(() => isBase(props))
  const size = computed(() => fontSize(props, base.value))
</script>

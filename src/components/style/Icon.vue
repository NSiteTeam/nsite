<template>
  <button data-tooltip-target="tooltip-animation" data-tooltip-placement="rigth" class="material-icons select-none align-middle" :class='size'>{{ icon }}</button>
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

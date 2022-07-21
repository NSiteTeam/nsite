<template>
  <div
    class='bg-slate-200 m-2 animate-pulse'
    :class="classes"
  ></div>
</template>

<script setup lang='ts'>
  import { computed } from "vue"
  import { isBase, roundedSize, textSize, TextSizes } from '@/utils/text_sizes'

  const props = defineProps(TextSizes)

  const base = computed(() => isBase(props))
  const classes = computed(() => {
    return `${textSize(props, base.value)} ${roundedSize(props, base.value)}`
  })
</script>

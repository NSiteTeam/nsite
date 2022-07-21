<template>
  <div
    class='rounded-full w-8 h-8 p-1 center select-none transition-colors'
    :class="{
      'hover:bg-gray-300/40': !disabled,
    }"
  >
    <Icon
      :class='{
        "text-black cursor-pointer": !disabled,
        "text-gray-400 cursor-default": disabled
      }'
      :icon='icon'
      :xs='xs'
      :sm='sm'
      :lg='lg'
      :xl='xl'
      :2xl='props["2xl"]'
      :3xl='props["3xl"]'
      :4xl='props["4xl"]'
      :5xl='props["5xl"]'
      :6xl='props["6xl"]'
      :7xl='props["7xl"]'
      :8xl='props["8xl"]'
      :9xl='props["9xl"]'
    />
  </div>
</template>

<script setup lang="ts">
  import Icon from '@/components/style/Icon.vue'
  import { TextSizes } from '@/utils/text_sizes'

  const props = defineProps({
    ...{
      icon: {
        type: String,
        required: true,
      },
      disabled: {
        type: Boolean,
        default: false,
      }
    },
    ...TextSizes,
  })
</script>
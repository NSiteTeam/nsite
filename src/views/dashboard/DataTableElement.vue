<template>
  <template v-if='type === "link"'>
    <a :href='value.url' class='underline block overflow-hidden text-blue-400 whitespace-nowrap text-ellipsis max-w-full'>
      {{ formatLink(value) }}
    </a>
  </template>

  <template v-else-if="type === 'boolean'">
    <div class='w-full text-center'>
      <Icon :icon='value ? "check" : "close"' />
    </div>
  </template>

  <template v-else>
    <span
      :class='{
        "text-primary bold whitespace-nowrap": type === "primary",
        "text-gray-600": type === "secondary"
      }'
    >
      {{ value }}
    </span>
  </template>
</template>

<script setup lang='ts'>
  import type { ThemeResourceFile } from "@/database/interface/school_program"
  import Icon from '@/components/style/Icon.vue'

  const NUMBER_OF_CHAR_PER_LINK = 40

  defineProps({
    type: {
      type: String,
      required: true,
    },
    value: {
      required: true,
    },
  })

  function formatLink(file: ThemeResourceFile) {
    return (file as any).name ?? file.url!!.slice(0, NUMBER_OF_CHAR_PER_LINK)
  }
</script>

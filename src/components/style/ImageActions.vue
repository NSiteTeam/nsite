<template>
  <div class="flex h-fit">
    <div
      @click="emit('delete', props.url)"
      class="material-icons absolute right-0 top-0 m-2 cursor-pointer rounded-xl bg-gray-400 p-2 text-red-700 hover:bg-gray-500"
    >
      delete
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import Icon from './Icon.vue'

const props = defineProps(['url'])

const emit = defineEmits(['delete'])
</script>

<template>
  <div class="flex items-center relative">
    <span class="material-icons text-white right-4 cursor-pointer w-8 absolute">search</span>
    <input
      v-model="input"
      type="text"
      @input="handleInput()"
      class="bg-primary shadow-2xl px-8 py-4 m-4 rounded-xl w-96 text-xl border-2 outline-0 text-white"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

function handleInput() {
  emit('update:modelValue', input.value)
}

const emit = defineEmits(['update:modelValue'])
const props = defineProps(['modelValue'])

const input = ref()
</script>

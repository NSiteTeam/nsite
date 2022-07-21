<template>
  <div class="flex flex-row w-min rounded-lg px-2 bg-gray-100 my-2 h-min">
    <template v-for='(value, index) in values' :key='index'>
      <div
        @click="selectValue(value)"
        class='bold mx-1 p-2 rounded-lg cursor-pointer select-none transition-all'
        :class='{
          "bg-primary text-white -translate-y-1": value === modelValue,
          "text-gray-700": value !== modelValue,
        }'
      >
        {{ value }}
      </div>
    </template>
  </div>
</template>

<script setup lang='ts'>
  import { ref } from 'vue'

  const props = defineProps({
    modelValue: String,
    values: {
      type: Array,
      default: () => []
    }
  })


  const emit = defineEmits(['update:modelValue'])

  const selectValue = (value: string) => {
    emit('update:modelValue', value)
  }
</script>

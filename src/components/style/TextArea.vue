<template>
  <div class='flex flex-col shouldMove'>
    <label
      v-if='label'
      class="block text-sm mb-0.5 ml-1"
      :for='id'
    >
      {{ label }}
    </label>
    <div
      class='
        flex flex-row items-center flex-1
        bg-gray-500/20 rounded-lg overflow-clip transition-colors
        focus-within:bg-transparent
        border-4 focus-within:border-primary
      '
      :class='{ "border-red-500": error.length != 0 }'
    >
      <textarea
        :id='id'
        class='
          bg-transparent resize-none
          focus:outline-none
          w-full h-full
          caret-primary
        '
        :class='{
          "py-3 px-4": !compact,
          "py-1.5 px-2.5": compact
        }'
        :placeholder='placeholder'
        :value='modelValue'
        @input='updateValue'
      ></textarea>
    </div>
    <p
      class='text-red-500 text-xs italic'
      :class="{
        'invisible': error.length == 0,
      }"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
  // @ts-ignore
  import ActionIcon from '@/components/style/ActionIcon.vue'
  import { uuid } from '@/utils/uuid'
  import { computed, ref } from 'vue'

  const props = defineProps({
    modelValue: String,
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
    compact: {
      type: Boolean,
      default: false,
    },
  })

  const id = uuid()
  const emit = defineEmits(['update:modelValue'])

  const updateValue = (event: any) => {
    emit('update:modelValue', event.target.value)
  }
</script>

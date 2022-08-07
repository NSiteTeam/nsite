<template>
  <div
    class='
    flex-1 flex flex-row items-center h-min mb-4 max-w-md
    border-4 border-gray-300 rounded-lg
    focus-within:border-primary caret-primary
    '
  >
    <Icon class='ml-2' icon='search' 2xl />
    <input
      ref='field'
      type='text'
      class='flex-grow p-2 text-base text-dark outline-none lg:w-40'
      placeholder='Géométrie repérée..'
      @input='updateValue'
      :value='modelValue'
    />
    <ActionIcon class='mr-2' icon='close' @click='clearField'/>
  </div>
</template>

<script setup lang='ts'>
  import Icon from "@/components/style/Icon.vue"
  import ActionIcon from "@/components/style/ActionIcon.vue"
  import { ref } from "vue"

  defineProps({
    modelValue: String
  })

  const field = ref<HTMLInputElement>()
  const emit = defineEmits(['update:modelValue'])

  const updateValue = (event: any) => {
    emit('update:modelValue', event.target.value)
  }

  const clearField = () => {
    field.value!!.value = ''
    emit('update:modelValue', '')
  }
</script>

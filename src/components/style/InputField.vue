<template>
  <div>
    <label
      v-if='label'
      class="block text-sm mb-0.5 ml-1"
      :for='id'
    >
      {{ label }}
    </label>
    <div
      class='
        flex flex-row items-center
        bg-gray-500/20 rounded-lg overflow-clip
        focus-within:bg-transparent
        border-4 focus-within:border-primary
      '
      :class='{ "border-red-500": error.length != 0 }'
    >
      <input
        :id='id'
        :type='updatedType'
        class='
          bg-transparent
          focus:outline-none
          py-3 px-4 w-full
          caret-primary
        '
        :placeholder='placeholder'
        :value='modelValue'
        @input='updateValue'
      />
      <ActionIcon
        v-if='isPasswordField'
        :icon='isPasswordVisible ? "visibility" : "visibility_off"'
        class='m-2'
        @click.prevent='togglePasswordVisibility'
      />
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
  import { uuid } from '@/utils/uuid'
  import { computed, ref } from 'vue'
  import ActionIcon from '@/components/style/ActionIcon.vue'

  const props = defineProps({
    modelValue: String,
    type: {
      type: String,
      default: 'text',
    },
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
  })

  const id = uuid()
  const emit = defineEmits(['update:modelValue'])

  const updateValue = (event: any) => {
    emit('update:modelValue', event.target.value)
  }

  /* PASSWORD */
  const togglePasswordVisibility = () => {
    if (!isPasswordField) {
      throw new Error('togglePasswordVisibility can only be called on password fields')
    }

    isPasswordVisible.value = !isPasswordVisible.value
  }

  const isPasswordField = computed(() => {
    return props.type == 'password'
  })
  const isPasswordVisible = ref(false)

  const updatedType = computed(() => {
    if (!isPasswordField.value) {
      return props.type
    } else if (isPasswordVisible.value) {
      return 'text'
    } else {
      return 'password'
    }
  })
</script>

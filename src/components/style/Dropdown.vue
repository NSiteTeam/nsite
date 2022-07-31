<template>
  <div>
    <label
      v-if='label'
      class="block text-sm mb-0.5 ml-1"
      :for='generatedId'
    >
      {{ label }}
    </label>
    <div
      :id='generatedId'
      ref='selectElement'
      class='
        relative transition-colors
        focus:bg-transparent
        border-4 focus:border-primary
        bg-gray-500/20 rounded-lg
      '
      tabindex="0"
      @click.prevent='clickOnSelect'
      role="combobox"
    >
      <div class="text-gray-900 select-none flex flex-row justify-between items-center h-9 mx-2.5">
        <p>{{ modelValue ?? choices[0] }}</p>
        <Icon icon='arrow_drop_down' class='text-gray-600'/>
      </div>

      <div
        class='absolute w-full top-12 left-0 bg-white origin-top shadow-lg rounded-xl border-gray-100 border-2 overflow-scroll max-h-36'
        :class='{ "hidden": !open, "animate-pop-out": open }'
      >
        <span
          v-for="option in choices" :value="option"
          :key="option"
          class='text-gray-900 select-none p-2 cursor-pointer block focus:border-primary focus:outline-none'
          :class="{
            'bg-gray-200 hover:bg-gray-300': option == modelValue,
            'hover:bg-gray-100': option != modelValue,
          }"
          @click.prevent='selectOption(option)'
        >
          {{ option }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  /**
   * TODO: Make this component "ARIA" compliant.
   *
   * (https://www.w3.org/WAI/ARIA/apg/example-index/combobox/combobox-select-only.html)
   */
  import { computed, onMounted, ref, watch } from 'vue'
  import type { Ref } from 'vue'
  import ShadowBox from '@/components/style/ShadowBox.vue'
  import Icon from '@/components/style/Icon.vue'
  import { uuid } from '@/utils/uuid'

  const props = defineProps({
    modelValue: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: '',
    },
    choices: {
      type: Array,
      default: [],
    }
  })

  const selectElement: Ref<HTMLElement | undefined> = ref()
  const open = ref(false)
  const generatedId = uuid()

  const emit = defineEmits(['update:modelValue'])

  onMounted(() => {
    selectElement.value!!.onblur = () => {
      open.value = false
    }
  })

  function clickOnSelect(event: MouseEvent) {
    if (open.value) {
      selectElement.value?.blur()
    } else {
      open.value = true
    }
  }

  function selectOption(option: string) {
    emit('update:modelValue', option)
  }
</script>

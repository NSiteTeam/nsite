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
        class='absolute w-full top-12 left-0 bg-white origin-top z-10 shadow-lg rounded-xl border-gray-100 border-2 overflow-scroll max-h-36'
        :class='{ "hidden": !isOpen, "animate-pop-out": isOpen }'
      >
        <span
          v-for="option in choices" :value="option"
          :key="option"
          class='text-gray-900 select-none p-2 cursor-pointer block'
          :class="{
            'bg-gray-200 hover:bg-gray-300': option == modelValue,
            'hover:bg-gray-100': option != modelValue,
          }"
          @click.prevent='selectOption(option)'
        >
          {{ option }}
        </span>
        <span
          @click='promptNew'
          class='italic border-t-2 border-gray-100 text-gray-900 select-none p-2 cursor-pointer block'
          :class='{ "hover:bg-gray-100": !isPrompting }'
        >
          <template v-if='!isPrompting'>
            <Icon icon='add' class='text-gray-600'/>
            Autre
          </template>
          <template v-else>
            <div class='flex w-full'>
              <input
                ref='inputElement'
                type='text'
                class='flex-1 outline-none caret-primary bg-transparent'
                @keyup.enter='addNew'
                @keydown.esc='closePromt'
              />
              <ActionIcon tabindex="0" icon='done' @click.stop='addNew'/>
              <ActionIcon tabindex="0" icon='close' @click.stop='closePrompt'/>
            </div>
          </template>
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
  import { computed, nextTick, onMounted, ref, watch } from 'vue'
  import type { Ref } from 'vue'
  import ShadowBox from '@/components/style/ShadowBox.vue'
  import Icon from '@/components/style/Icon.vue'
  import ActionIcon from '@/components/style/ActionIcon.vue'
  import { uuid } from '@/utils/uuid'
  import { PopupManager } from '@/views/popup/popup_manager'

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
  const inputElement: Ref<HTMLInputElement | undefined> = ref()
  const isPrompting = ref(false)
  const isOpen = ref(false)
  const generatedId = uuid()

  const emit = defineEmits(['update:modelValue', 'addedValue'])

  onMounted(() => {
    selectElement.value!!.onblur = () => {
      isOpen.value = false
    }
  })

  watch(inputElement, () => {
    if (inputElement.value) {
      inputElement.value!!.onblur = (event) => {
        if (selectElement.value!!.contains(event.relatedTarget as Node)) {
          return
        }
        isPrompting.value = false
        isOpen.value = false
      }
    }
  })

  function clickOnSelect(event: MouseEvent) {
    if (isOpen.value) {
      selectElement.value?.blur()
    } else {
      isOpen.value = true
    }
  }

  function selectOption(option: string) {
    emit('update:modelValue', option)
  }

  function promptNew() {
    isPrompting.value = true
    nextTick(() => {
      inputElement.value?.focus()
    })
  }

  function addNew(event: Event) {
    const newValue = inputElement.value?.value
    emit('addedValue', newValue)
    emit('update:modelValue', newValue)
    isPrompting.value = false
    isOpen.value = false
  }

  function close() {
    isPrompting.value = false
    isOpen.value = false
  }

  function closePrompt() {
    isPrompting.value = false
    isOpen.value = false
  }
</script>

<template>
  <Overlay :on='isOpen' @click='collapse' subnavbar />
  <div v-show='displayPanel' class='fixed bottom-0 right-0 w-screen h-main max-w-lg z-30'>
    <div
      ref='panelContainer'
      class='transition-all w-full h-full bg-white shadow-lg border-l-2 border-gray-100 opacity-0 translate-x-full overflow-y-auto'
    >
      <div class='p-4'>
        <MediumTitle>{{ title }}</MediumTitle>
        <p class='text-gray-600 italic text-justify'>{{ description }}</p>
      </div>
      <div class='p-4'>
        <slot/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Overlay from '@/components/style/Overlay.vue'
  import MediumTitle from '@/components/style/MediumTitle.vue'
  import { computed, onMounted, ref, watch } from 'vue'
  import { nextFrame } from '@/utils/next_frame'

  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  })

  const panelContainer = ref<HTMLElement>()
  const displayPanel = ref(props.isOpen)
  watch(props, () => {
    if (props.isOpen) {
      displayPanel.value = true
      nextFrame(() => panelContainer.value!.classList.remove('opacity-0', 'translate-x-full'))
    } else {
      panelContainer.value!.classList.add('opacity-0', 'translate-x-full')
      setTimeout(() => {
        displayPanel.value = false
      }, 150)
    }
  })

  const emit = defineEmits(['cancel'])

  function collapse() {
    emit('cancel')
  }

</script>

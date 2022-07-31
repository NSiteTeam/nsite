<template>
  <div
    class='h-main overflow-x-hidden transition-all border-r-2 border-gray-100 whitespace-nowrap'
    :class="{
      'w-full md:w-80': expanded,
      'w-12 overflow-y-clip': !expanded
    }"
  >
    <div class='p-4 relative'>
      <MediumTitle
        class='shrink transition-opacity'
        :class='{
          "opacity-0": !expanded
        }'
      >{{ title }}</MediumTitle>
      <div class='absolute right-0 top-0 w-full h-full flex items-center justify-end pr-2'>
        <ActionIcon
          class='-rotate-90 transition-transform'
          :class='{
            "-scale-y-100": !expanded,
          }'
          icon='expand_less'
          @click='flipExpand'
        />
      </div>
    </div>
    <div
      class='overflow-y-hidden w-full transition-opacity p-4'
      :class="{
        'opacity-0': !expanded,
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang='ts'>
  import MediumTitle from '@/components/style/MediumTitle.vue'
  import ActionIcon from '@/components/style/ActionIcon.vue'
  import { ref } from 'vue'

  defineProps({
    title: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(['open', 'close'])

  const expanded = ref(true)

  function flipExpand() {
    expanded.value = !expanded.value
    if (expanded.value) {
      emit('open')
    } else {
      emit('close')
    }
  }
</script>

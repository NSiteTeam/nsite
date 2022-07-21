<template>
  <div class='fixed bottom-0 right-0 mr-8 mb-8'>
    <div
      class='
        rounded-full bg-secondary text-white  cursor-pointer
        p-1 w-12 h-12 center
        transition-all hover:-translate-y-2
      '
      :class="{
        'opacity-0': !visible,
        'opacity-100': visible
      }"
      @click='goToTop'
    >
      <Icon icon='arrow_upward' 3xl />
    </div>
  </div>
</template>

<script setup lang='ts'>
  import Icon from '@/components/style/Icon.vue'
  import { ref } from 'vue'

  const visible = ref(false)

  window.onscroll = () => {
    visible.value = window.scrollY > 200
  }

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
</script>
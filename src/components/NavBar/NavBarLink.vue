<template>
  <div
    class='h-full flex justify-center items-center relative'
    :class="{
      'after:content-[\'\'] after:absolute': isActive,
      'after:from-primary after:to-transparent': isActive,
      'pl-6': minify,
      'after:bottom-0 after:h-1 after:w-full after:bg-gradient-to-t after:rounded-t-full after:left-0': isActive && !minify,
      'after:left-0 after:w-1.5 after:h-full after:bg-gradient-to-r after:rounded-r-full': isActive && minify,
    }"
  >
    <RouterLink :to='to'>
      <span
        class='hover:text-accent transition-all text-lg leading-loose inline-block hover:text-primary'
        :class="{
          'mx-4': !minify,
          'translate-x-2': minify && isActive,
        }"
      >
        <slot />
      </span>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "@vue/runtime-core"
  import { useRoute } from "vue-router"

  const route = useRoute()

  const props = defineProps({
    to: {
      type: String,
      default: ''
    },
    minify: {
      type: Boolean,
      default: false
    }
  })

  const isActive = computed(() => {
    return route.matched.some(({ path }) => path.startsWith(props.to))
  })

</script>

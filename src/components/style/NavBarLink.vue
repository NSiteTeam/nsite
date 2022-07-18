<template>
  <div
    :class="{
      'h-full center relative': true,
      'after:content-[\'\'] after:absolute': isActive,
      'after:from-marker after:via-marker after:to-transparent': isActive,
      'pl-6': minify,
      'after:bottom-0 after:h-1.5 after:w-full after:bg-gradient-to-t': isActive && !minify,
      'after:left-0 after:w-1.5 after:h-full after:bg-gradient-to-r': isActive && minify,
    }"
  >
    <RouterLink :to='to' active-class="">
      <span
        :class="{
          'hover:text-marker transition-colors text-lg leading-loose': true,
          'mx-4': !minify,
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

import { computed, onMounted, onUnmounted, ref } from "vue"
import type { Ref } from "vue"

export default function () {
  const windowWidth: Ref<number> = ref(window.innerWidth)

  const onWidthChange = () => windowWidth.value = window.innerWidth

  onMounted(() => window.addEventListener('resize', onWidthChange))
  onUnmounted(() => window.removeEventListener('resize', onWidthChange))
  
  const type = computed(() => {
    if (windowWidth.value < 550) return 'xs'
    if (windowWidth.value >= 550 && windowWidth.value < 1200) return 'md'
    if (windowWidth.value >= 1200) return 'lg'
  })

  const width = computed(() => windowWidth.value)

  return { width, type }
}
<template>
  <div class='p-8'>
    <template v-if='themeLoaded'>

      <LargeTitle>
        Ressources pour le thème
        "<Keyword primary>{{ theme.name }}</Keyword>"
      </LargeTitle>

      <p class="text-gray-600 text-lg font-semibold">
        {{ theme.description }}
      </p>

      <div>

      </div>

    </template>
    <template v-else>

      <LargeTitle class='w-3/5' skeleton />
      <SkeletonText lg class='w-full'/>
      <SkeletonText lg class='w-full'/>
      <SkeletonText lg class='w-2/3'/>

    </template>
  </div>
</template>

<script setup lang='ts'>
  import LargeTitle from '@/components/style/LargeTitle.vue'
  import Keyword from '@/components/style/Keyword.vue'
  import SkeletonText from '@/components/style/SkeletonText.vue'
  import { useRoute } from 'vue-router'
  import { databaseClient } from '@/database/implementation'
  import { getParameterOfRoute } from '@/utils/route_utils'
  import { ref } from 'vue'
  import type { Ref } from 'vue'
  import type { Theme } from '@/database/interface/school_program'

  const route = useRoute()

  const themeLoaded = ref(false)
  const theme: Ref<Theme | null> = ref(null)

  const resourcesLoaded = ref(false)

  databaseClient.getThemeByUuid(getParameterOfRoute(route.params.themeUuid)).then(value => {
    theme.value = value
    themeLoaded.value = true
  })
</script>

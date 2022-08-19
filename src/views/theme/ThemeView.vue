<template>
  <div>
    <template v-if="themeLoaded && theme">
      <div class="p-8">
        <LargeTitle>
          Ressources pour le thème "<Keyword big primary>{{
            theme.name
          }}</Keyword
          >"
        </LargeTitle>

        <p class="text-gray-600 text-lg font-semibold">
          {{ theme.description }}
        </p>
      </div>
    </template>

    <template v-else-if="themeLoaded">
      <div class="p-8">
        <LargeTitle> Le thème demandé n'existe pas </LargeTitle>
      </div>
    </template>

    <template v-else>
      <div class="p-8">
        <LargeTitle class="w-3/5" skeleton />
        <SkeletonText class="w-full" />
        <SkeletonText class="w-full" />
        <SkeletonText class="w-2/3" />
      </div>
    </template>

    <template v-if="!themeLoaded || theme">
      <HorizontalRadio
        class="md:hidden m-8"
        :values="columnNames"
        :modelValue="selectedColumnName"
        @update:modelValue="scrollToElement"
      />
      <div class="flex flex-row overflow-x-scroll snap-x snap-mandatory">
        <template v-for="(column, index) in columns" :key="index">
          <div class="snap-start" ref="columnContainers">
            <div class="w-screen p-8">
              <MediumTitle>{{ column.title }}</MediumTitle>

              <template v-if="resourcesLoaded && column.items.length > 0">
                <template v-for="(item, index) in column.items" :key="index">
                  <ShadowBox class="bg-white/10 h-min">
                    <SmallTitle>
                      {{ item.name }}
                      <span class="italic text-gray-600 text-xs">
                        {{ item.date }}
                      </span>
                    </SmallTitle>
                    <p class="text-gray-600 font-semibold">
                      {{ item.message }}
                    </p>
                    <div class="mt-4">
                      <div
                        v-for="(link, linkIndex) in item.content"
                        :key="linkIndex"
                      >
                        <a
                          download
                          target="_blank"
                          :href="link.url"
                          class="underline"
                          :class="{
                            'text-blue-500': !link.name,
                            'text-gray-600 bold': link.name,
                          }"
                        >
                          <Icon :icon="link.name ? 'file_download' : 'link'" />
                          {{ link.name ?? link.url }}
                        </a>
                      </div>
                    </div>
                  </ShadowBox>
                </template>
              </template>

              <template v-else-if="resourcesLoaded">
                <p class="text-center text-gray-400 italic text-lg mt-8">
                  Aucune ressource dans cette catégorie
                </p>
              </template>

              <template v-else>
                <ShadowBox
                  v-for="cards in skeletonCardsFor(index)"
                  :key="cards"
                >
                  <SmallTitle class="w-1/2" skeleton />
                  <SkeletonRect class="w-full aspect-video" />
                  <SkeletonText class="w-full" />
                  <SkeletonText class="w-full" />
                  <SkeletonText class="w-2/3" />
                </ShadowBox>
              </template>
            </div>
          </div>
        </template>
      </div>
      <div class="h-4"></div>
    </template>
  </div>

  <Footer />
</template>

<script setup lang="ts">
import LargeTitle from '@/components/style/LargeTitle.vue'
import MediumTitle from '@/components/style/MediumTitle.vue'
import SmallTitle from '@/components/style/SmallTitle.vue'
import SkeletonRect from '@/components/style/SkeletonRect.vue'
import Keyword from '@/components/style/Keyword.vue'
import SkeletonText from '@/components/style/SkeletonText.vue'
import HorizontalRadio from '@/components/style/HorizontalRadio.vue'
import ShadowBox from '@/components/style/ShadowBox.vue'
import Footer from '@/components/Footer.vue'
import Icon from '@/components/style/Icon.vue'
import { useRoute } from 'vue-router'
import { databaseClient } from '@/database/implementation'
import { getParameterOfRoute } from '@/utils/route_utils'
import { onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type {
  Theme,
  ThemeResource,
  ThemeResourceFile,
} from '@/database/interface/school_program'
import { supabase } from '@/database/supabase/supabase_client'
import { MessageStack } from '@/views/messages/message_stack'

const route = useRoute()

const themeLoaded = ref(false)
const theme: Ref<Theme | null> = ref(null)

const resourcesLoaded = ref(false)

const themeUUID = getParameterOfRoute(route.params.themeUuid)
databaseClient
  .getThemeByUuid(themeUUID)
  .then((value) => {
    theme.value = value
  })
  .catch(MessageStack.logError)
  .finally(() => {
    themeLoaded.value = true
  })

type Column = {
  title: string
  items: ThemeResourceFile[]
}

const columns: Ref<Column[]> = ref([])

databaseClient
  .getThemeResources(themeUUID)
  .then((resources) => {
    resources?.reduce((acc, resource) => {
      const column = acc.find((c) => c.title === resource.type)
      if (column) {
        column.items.push(resource)
      } else {
        acc.push({
          title: resource.type,
          items: [resource],
        })
      }
      return acc
    }, columns.value)
  })
  .catch(MessageStack.logError)
  .finally(() => {
    resourcesLoaded.value = true
  })

const columnNames = columns.value.map((column) => column.title)
const selectedColumnName = ref('Exercices')
const columnContainers = ref<HTMLElement[]>([])

const columnObserver = new IntersectionObserver(
  (entries) => {
    console.log(entries)
    entries.forEach((column) => {
      if (column.isIntersecting) {
        const index = Array.from(
          column.target.parentElement!!.children,
        ).indexOf(column.target)
        selectedColumnName.value = columns.value[index].title
      }
    })
  },
  {
    threshold: 0.51,
    rootMargin: '999999px 0px 999999px 0px', // This is a hack to make the observer work only horizontally
  },
)

watch(columnContainers, () => {
  columnContainers.value.forEach((container) => {
    columnObserver.observe(container)
  })
})

const scrollToElement = (newValue: string) => {
  const index = columnNames.indexOf(newValue)
  const target = columnContainers.value[index]
  if (target) {
    target.parentElement!.scroll({
      left: target.offsetLeft,
      behavior: 'smooth',
    })
  }
}

const skeletonCardsNumber: number[] = []
const skeletonCardsFor = (index: number) => {
  if (skeletonCardsNumber[index] === undefined) {
    skeletonCardsNumber[index] = Math.floor(Math.random() * 4) + 1
  }

  return skeletonCardsNumber[index]
}
</script>

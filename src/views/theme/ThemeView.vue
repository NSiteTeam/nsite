<template>
  <div>
    <template v-if='themeLoaded && theme'>
      <div class='p-8'>
        <LargeTitle>
          Ressources pour le thème
          "<Keyword primary>{{ theme.name }}</Keyword>"
        </LargeTitle>

        <p class="text-gray-600 text-lg font-semibold">
          {{ theme.description }}
        </p>
      </div>

    </template>

    <template v-else-if="themeLoaded">
      <div class='p-8'>
        <LargeTitle>
          Le thème demandé n'existe pas
        </LargeTitle>
      </div>
    </template>

    <template v-else>

      <div class='p-8'>
        <LargeTitle class='w-3/5' skeleton />
        <SkeletonText class='w-full'/>
        <SkeletonText class='w-full'/>
        <SkeletonText class='w-2/3'/>
      </div>
    </template>

    <template v-if='!themeLoaded || theme'>
      <HorizontalRadio
        class='md:hidden m-8'
        :values="columnNames"
        :modelValue='selectedColumnName'
        @update:modelValue='scrollToElement'
      />
      <div class='flex flex-row overflow-x-scroll snap-x snap-mandatory'>
        <template v-for='(column, index) in columns' :key='index'>

          <div class='snap-start' ref='columnContainers'>
            <div class='w-screen p-8'>
              <MediumTitle>{{ column.title }}</MediumTitle>

              <template v-if='resourcesLoaded && column.items.length > 0'>
                <template v-for='(item, index) in column.items' :key="index">
                  <ShadowBox class='bg-white/10 h-min'>
                    <SmallTitle>{{ item.name }}</SmallTitle>

                    <div v-if='item.previewData' class=''>
                      <p class='text-primary bold'>{{ item.previewTitle }}</p>
                      <img v-if='item.previewURL' :src='item.previewURL' class='w-full aspect-video object-cover' />
                    </div>

                    <p class="text-gray-600 font-semibold">
                      {{ item.message }}
                    </p>
                  </ShadowBox>
                </template>
              </template>

              <template v-else-if='resourcesLoaded'>
                <p class='text-center text-gray-400 italic text-lg mt-8'>
                  Aucune ressource dans cette catégorie
                </p>
              </template>

              <template v-else>
                <ShadowBox v-for='cards in skeletonCardsFor(index)' :key='cards'>
                  <SmallTitle class='w-1/2' skeleton />
                  <SkeletonRect class='w-full aspect-video'/>
                  <SkeletonText class='w-full'/>
                  <SkeletonText class='w-full'/>
                  <SkeletonText class='w-2/3'/>

                </ShadowBox>
              </template>

            </div>
          </div>

        </template>
      </div>
      <div class='h-4'></div>
    </template>
  </div>

  <Footer />
</template>

<script setup lang='ts'>
  import LargeTitle from '@/components/style/LargeTitle.vue'
  import MediumTitle from '@/components/style/MediumTitle.vue'
  import SmallTitle from '@/components/style/SmallTitle.vue'
  import SkeletonRect from '@/components/style/SkeletonRect.vue'
  import Keyword from '@/components/style/Keyword.vue'
  import SkeletonText from '@/components/style/SkeletonText.vue'
  import HorizontalRadio from '@/components/style/HorizontalRadio.vue'
  import ShadowBox from '@/components/style/ShadowBox.vue'
  import Footer from '@/components/Footer.vue'
  import { useRoute } from 'vue-router'
  import { databaseClient } from '@/database/implementation'
  import { getParameterOfRoute } from '@/utils/route_utils'
  import { onMounted, ref, watch } from 'vue'
  import type { Ref } from 'vue'
  import type { Theme, ThemeResource } from '@/database/interface/school_program'
  import { ThemeResourceType } from '@/database/interface/school_program'
import { supabase } from '@/database/supabase/supabase_client'

  const route = useRoute()

  const themeLoaded = ref(false)
  const theme: Ref<Theme | null> = ref(null)

  const resourcesLoaded = ref(false)

  const themeUUID = getParameterOfRoute(route.params.themeUuid)
  databaseClient.getThemeByUuid(themeUUID).then(value => {
      theme.value = value
    })
    .finally(() => {
      themeLoaded.value = true
    })

  type ColumnItem = {
    name: string,
    message?: string,
    internal_resource: boolean
    type: ThemeResourceType,
    contentURL?: string,
    previewData: boolean,
    previewURL?: string
    previewTitle?: string
    previewDescription?: string
  }

  type Column = {
    title: string,
    items: ColumnItem[]
  }

  const columns: Ref<Column[]> = ref([
    {
      title: 'Exercices',
      items: []
    },
    {
      title: 'Interrogations',
      items: []
    },
    {
      title: 'Autres',
      items: []
    }
  ])

  databaseClient.getThemeResources(themeUUID)
    .then(resources => {
      if (!resources) return

      let updatedResources = resources.map(resource => {
        const updatedResource: ColumnItem = {
          name: resource.name,
          message: resource.message,
          internal_resource: resource.internalResource,
          contentURL: resource.contentURL,
          type: resource.type,
          previewData: false,
          previewURL: undefined,
          previewTitle: undefined,
          previewDescription: undefined
        }

        if (!resource.internalResource && resource.contentURL) { // We try to get a preview
          databaseClient.getPreviewDataOfURL(resource.contentURL)
            .then((previewData) => {
              if (previewData.title) {
                updatedResource.previewTitle = previewData.title
              }
              if (previewData.description) {
                updatedResource.previewDescription = previewData.description
              }
              if (previewData.image) {
                updatedResource.previewURL = previewData.image
              }

              updatedResource.previewData = true
            })
        }

        return updatedResource
      })

      columns.value[0].items = updatedResources.filter(item => item.type == ThemeResourceType.EXERCISES)
      columns.value[1].items = updatedResources.filter(item => item.type == ThemeResourceType.INTERROGATION)
      columns.value[2].items = updatedResources.filter(item => item.type == ThemeResourceType.OTHER)
    })
    .finally(() => {
      resourcesLoaded.value = true
    })

  const columnNames = columns.value.map(column => column.title)
  const selectedColumnName = ref('Exercices')
  const columnContainers = ref<HTMLElement[]>([])

  const columnObserver = new IntersectionObserver((entries) => {
    console.log(entries)
    entries.forEach(column => {
      if (column.isIntersecting) {
        const index = Array.from(column.target.parentElement!!.children).indexOf(column.target)
        selectedColumnName.value = columns.value[index].title
      }
    })
  }, {
    threshold: 0.51,
    rootMargin: '999999px 0px 999999px 0px' // This is a hack to make the observer work only horizontally
  })

  watch(columnContainers, () => {
    columnContainers.value.forEach(container => {
      columnObserver.observe(container)
    })
  })

  const scrollToElement = (newValue: string) => {
    const index = columnNames.indexOf(newValue)
    const target = columnContainers.value[index]
    if (target) {
      target.parentElement!.scroll({
        left: target.offsetLeft,
        behavior: 'smooth'
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

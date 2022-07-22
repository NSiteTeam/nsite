<template>
  <div class='p-4 md:p-8'>
    <GoToTop />
    <LargeTitle>Programme de mathématiques, du <Keyword secondary>collège</Keyword>
    au <Keyword tertiary>lycée.</Keyword></LargeTitle>
    <p class="text-gray-600 text-lg font-semibold">
      Découvrez chacun des thèmes présents dans le programe de <span class='text-primary bold'>
      mathématiques</span>, du collège au lycée.
      <br>
      A chaque thème est associé des fiches <Keyword primary bold>d'exercices</Keyword> ainsi que
      d'anciennes interrogations pour <Keyword primary bold>s'entraîner</Keyword>.
    </p>


    <!--Spacer-->
    <div class='h-10'></div>

    <div class="px-4">
      <MediumTitle>Filtrer votre recherche</MediumTitle>
        <div class='block sm:hidden'>
          <SearchInput class='mt-4' v-model='search' />
          <div class='flex overflow-x-scroll'>
            <HorizontalRadio class='mr-2' :values='toStrings(SUPER_FILTERS)' v-model='filter' />
            <HorizontalRadio class='mx-2' :values='toStrings(COLLEGE_FILTERS)' v-model='filter' />
            <HorizontalRadio class='ml-2' :values='toStrings(LYCEE_FILTERS)' v-model='filter' />
          </div>
        </div>

        <div class='hidden sm:block xl:hidden'>
          <div class='flex flex-col max-w-min'>
            <div class='flex flex-row'>
              <SearchInput class='flex-1' v-model='search' />
              <HorizontalRadio class='mx-2' :values='toStrings(SUPER_FILTERS)' v-model='filter' />
            </div>
            <div class=''>
              <div class='flex overflow-x-scroll'>
                <HorizontalRadio class='mr-2' :values='toStrings(COLLEGE_FILTERS)' v-model='filter' />
                <HorizontalRadio class='mx-2' :values='toStrings(LYCEE_FILTERS)' v-model='filter' />
              </div>
            </div>
          </div>
        </div>

        <div class='hidden xl:block'>
          <div class='flex flex-row'>
            <SearchInput class='flex-1 basis-1' v-model='search' />
            <HorizontalRadio class='mx-2' :values='toStrings(SUPER_FILTERS)' v-model='filter' />
            <HorizontalRadio class='mx-2' :values='toStrings(COLLEGE_FILTERS)' v-model='filter' />
            <HorizontalRadio class='mx-2' :values='toStrings(LYCEE_FILTERS)' v-model='filter' />
          </div>
        </div>
    </div>

    <template v-if='sections.length'>
      <template v-for='(section, row_index) in sections' :key='row_index'>
        <div class='flex items-center mt-8' @click='collaspseSectionAt(row_index)'>
          <CollapseIcon
            :collapsed='!section.expanded'
            :disabled='loaded && section.content.length < 1' />
          <MediumTitle class='ml-4'>
            {{ section.level.fullName }}
            <span
              v-if='loaded && section.content.length == 0'
              class='ml-4 text-gray-400 italic text-xs font-semibold'
            >
              (Ce niveau est vide)
            </span>
          </MediumTitle>

          <BarSeparator class='flex-1'/>
        </div>
        <div class='relative'>
          <div
            class='flex flex-row items-stretch flex-nowrap overflow-x-auto snap-x snap-mandatory md:flex-wrap'
            :class='{
              "hidden": !section.expanded
            }'
          >
            <template v-if='loaded'>

                <template v-if='section.content.length'>
                  <ShadowBox
                    v-for='(theme, column_index) in section.content' :key='column_index'
                    class='w-80 shrink-0 flex flex-col md:justify-between snap-start'
                    reactOnHover
                    @click='goToTheme(theme)'
                  >
                    <div>
                      <SmallTitle>{{ theme.name }}</SmallTitle>
                      <p>{{ theme.description }}</p>
                    </div>
                    <div class="flex flex-wrap justify-around mt-4">
                      <Badge primary><Keyword bold>{{ theme.numberOfExercises }}</Keyword> fiches d'exercices </Badge>
                      <Badge tertiary><Keyword bold>{{ theme.numberOfInterrogations }}</Keyword> interrogations</Badge>
                      <Badge secondary><Keyword bold>{{ theme.numberOfCorrections }}</Keyword> corrigés</Badge>
                    </div>
                  </ShadowBox>
                </template>

            </template>
            <template v-else>

              <ShadowBox class='w-80 shrink-0' v-for='index in numberOfCards()' :key='index' reactOnHover>
                <SmallTitle skeleton class='w-32'/>
                <SkeletonText class='w-full' />
                <SkeletonText class='w-full' />
                <SkeletonText class='w-full' />
                <SkeletonText class='w-full' />
                <SkeletonText class='w-2/3' />
                <div class='mt-8'>
                    <SkeletonText class='w-10 inline-block' />
                    <SkeletonText class='w-10 inline-block' />
                    <SkeletonText class='w-10 inline-block' />
                </div>
              </ShadowBox>

            </template>
          </div>
          <!--On phone, we show some dot to indicate to the user that he can scroll-->
          <div v-if='section.expanded' class='sm:hidden absolute h-min center w-full mt-2'>
            <GreyDot v-for='index in min(section.content.length, 8)' :key='index' />
            <GreyDot v-if='section.content.length > 8' xs />
          </div>

        </div>
      </template>
    </template>

    <template v-else>
      <p class='text-center text-gray-400 italic text-lg mt-8'>
        Aucun résultat trouvés pour ces filtres 😢
      </p>
    </template>
  </div>
  <div class='h-16'></div>
  <Footer />
</template>

<script setup lang="ts">
  /**
   * TODO: 1. Store the level of the user to be able to display it on top
   *       2. Suggest last themes consulted by the user
   *       3. On phone, make that when the user click on a card and go back, the scroll position is restored
   */

  import { databaseClient } from "@/database/implementation"
  import type { SchoolProgram, Theme } from "@/database/interface/school_program"
  import { Level, School } from "@/database/interface/level"
  import { computed, onMounted, ref, watch } from "vue"
  import type { Ref } from 'vue'
  import SearchInput from './SearchInput.vue'
  import ShadowBox from "@/components/style/ShadowBox.vue"
  import Icon from "@/components/style/Icon.vue"
  import ActionIcon from "@/components/style/ActionIcon.vue"
  import GreyDot from "@/components/style/GreyDot.vue"
  import SkeletonText from "@/components/style/SkeletonText.vue"
  import Keyword from "@/components/style/Keyword.vue"
  import LargeTitle from "@/components/style/LargeTitle.vue"
  import MediumTitle from "@/components/style/MediumTitle.vue"
  import SmallTitle from "@/components/style/SmallTitle.vue"
  import BarSeparator from "@/components/style/BarSeparator.vue"
  import Badge from "@/components/style/Badge.vue"
  import CollapseIcon from "@/components/style/CollapseIcon.vue"
  import GoToTop from "@/components/style/GoToTop.vue"
  import InputField from "@/components/style/InputField.vue"
  import HorizontalRadio from "@/components/style/HorizontalRadio.vue"
  import Footer from "@/components/Footer.vue"
  import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router"
  import { useWindowSize } from "vue-window-size"
  import { getParameterOfRoute, getQueryParameterOfRoute } from "@/utils/route_utils"
import { MessageStack, MessageType } from "@/utils/message_stack"

  const route = useRoute()
  const router = useRouter()
  const { width: windowsWidth } = useWindowSize()

  /* FILTERS */

  type Filter = {
    name: string,
    nameInUrl: string,
  }

  const ALL_FILTER = {
    name: "Tout",
    nameInUrl: "all",
  }

  const SUPER_FILTERS = [
    ALL_FILTER
  ].concat(School.SCHOOLS.map(school => ({
    name: school.name,
    nameInUrl: school.nameInUrl,
  })))

  const COLLEGE_FILTERS = Level.COLLEGE_LEVELS.map(level => ({
    name: level.fullName,
    nameInUrl: level.nameInURL,
  }))

  const LYCEE_FILTERS = Level.LYCEE_LEVELS.map(level => ({
    name: level.fullName,
    nameInUrl: level.nameInURL,
  }))

  const ALL_FILTERS = SUPER_FILTERS.concat(COLLEGE_FILTERS).concat(LYCEE_FILTERS)

  const getSearch = () => decodeURI(getQueryParameterOfRoute(route.query['search']) ?? '')
  const getFilterName = () => ALL_FILTERS.find(filter => filter.nameInUrl === getQueryParameterOfRoute(route.query['filter']))?.name ?? ALL_FILTER.name

  const search = ref(getSearch())
  const filter = ref(getFilterName())

  watch(route.query, (_) => {
    search.value = getSearch()
    filter.value = getFilterName()
  })


  /* PROGRAM */

  type Section = {
    level: Level,
    expanded: boolean,
    content: Theme[],
  }

  const program: Ref<SchoolProgram | null> = ref(null)
  const loaded = ref(false)
  databaseClient.getProgram()
    .then(value => {
      program.value = value
    })
    .catch(() => {
      MessageStack.getInstance().push({
        type: MessageType.ERROR,
        text: "Impossible de charger le programme scolaire",
        timeout: 5000,
      })
    })
    .finally(() => {
      loaded.value = true
    })

  /* SECTIONS */

  const computeSections = () => {
    /* First we compute all the sections */
    const allSections = Level.LEVELS.map(level => {
      if (!level) {
        throw new Error(`Could not find level for filter ${filter.value}`)
      }
      return {
        level: level,
        expanded: program.value?.get(level).length != 0 && (windowsWidth.value > 768 || search.value != '' || !SUPER_FILTERS.map(f => f.name).includes(filter.value)),
        content: program.value?.get(level) ?? []
      }
    })

    /* Then we make a filter function to keep only the sections that match the filter */
    let filterLevels: (level: Level) => boolean
    if (filter.value === ALL_FILTER.name) {
      filterLevels = (_: Level) => true
    } else if (SUPER_FILTERS.map((filter) => filter.name).includes(filter.value)) {
      filterLevels = (level: Level) => level.school.name === filter.value
    } else {
      filterLevels = (level: Level) => level.fullName === filter.value
    }

    /* We create another filter function to keep only the sections that match the search */
    let filterSearch: (theme: Theme) => boolean
    if (search.value == '') {
      filterSearch = (_: Theme) => true
    } else {
      filterSearch = (theme: Theme) => theme.name.toLowerCase().includes(search.value.toLowerCase())
    }

    return allSections
      .filter(section => filterLevels(section.level))  // We keep only the sections that match the filter
      .map((section: Section) => ({ // We create a new section with the content that match the search
        ...section,
        content: section.content.filter(filterSearch)
      }))
      .filter(section => !loaded.value || !search.value || section.content.length > 0) // If the program is loaded and there is a search, we keep the section with content found
  }
  const sections = ref(computeSections())
  watch([program, windowsWidth, filter, search], () => sections.value = computeSections())

  watch([filter, search], (values) => {
    const [newFilterName, newSearch] = values

    const newFilter = ALL_FILTERS.find(filter => filter.name === newFilterName) ?? ALL_FILTER

    let query = {}

    if (newSearch.trim() != '') {
      query = {
        ...query,
        search: newSearch
      }
    }

    if (newFilter != ALL_FILTER) {
      query = {
        ...query,
        filter: newFilter.nameInUrl
      }
    }

    router.replace({
      path: route.path,
      query: query
    })
  })


  const collaspseSectionAt = (index: number) => {
    if (sections.value[index].content.length > 0) {
      sections.value[index].expanded = !sections.value[index].expanded
    }
  }

  const numberOfCards = () => { // 1, 2 or 3
    return Math.floor(Math.random() * 3) + 1
  }

  const goToTheme = (theme: Theme) => {
    router.push({
      name: 'themes',
      params: {
        themeUuid: theme.uuid.toString()
      }
    })
  }

  const toStrings = (array: any[]) => array.map(filter => filter.name)

  const min = (a: number, b: number) => a < b ? a : b
</script>

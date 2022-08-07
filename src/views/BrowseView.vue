<template>
  <div class="p-8">
    <div class="filters flex flex-col justify-center">
      <div class="flex w-full justify-center">
        <SearchInput type="text" v-model="searchbarContent" />
      </div>
      <ul class="level-buttons justify-center">
        <h2 class="text-xl font-bold">Niveaux :</h2>
        <li
          class="shadow-xl shadow-black/10"
          v-bind:class="{ 'border-2 border-primary': level == selectedLevel }"
          @click="selectLevel(null)"
        >
          <RouterLink class="font-bold" to="/browse/"> Tout </RouterLink>
        </li>
        <li
          v-bind:class="{ 'border-2 border-primary': level == selectedLevel }"
          class="level-button shadow-xl shadow-black/10"
          @click="selectLevel(level)"
          v-for="level in levels"
          :key="level"
        >
          <RouterLink class="font-bold" :to="'/browse/' + level.nameInURL">
            {{ level.abbreviated }}
          </RouterLink>
        </li>
      </ul>

      <ul class="sort-keys justify-center">
        <h2 class="text-xl font-bold">Type de tri :</h2>
        <button
          class="mx-8 rounded-xl items-center flex p-4 text-xl font-bold text-dark shadow-xl shadow-black/10"
          @click="changeOrder()"
        >
          <span v-if="reversed" class="material-icons"> arrow_drop_up </span>
          <span v-else class="material-icons"> arrow_drop_down </span>
          Ordre {{ reversed ? 'Croissant' : 'Décroissant' }}
        </button>

        <li
          @click="changeSort(sortType)"
          v-bind:class="{ 'border-2 border-primary': sort == sortType }"
          class="rounded-xl p-4 my-4 text-xl font-bold text-dark shadow-xl shadow-black/10"
          v-for="sortType in Sort"
          :key="sortType"
        >
          {{ sortType }}
        </li>
      </ul>
    </div>
    <h2 class="text-3xl font-bold text-primary">Résultats :</h2>
    <div v-if="loading" class="loading-container">
      <LoadingAnimation size="25%" />
    </div>
    <div v-else-if="!output.length" class="center-text">
      <p>Aucun depôt trouvé</p>
    </div>
    <Transition v-else name="fade">
      <div id="browse-container">
        <Card :exercise="repo" v-for="repo in output" :key="repo.id" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { databaseClient } from '@/database/implementation'
import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type { Repository } from '@/database/interface/repositories'
import Card from '@/components/Card.vue'
import LoadingAnimation from '@/components/LoadingAnimation.vue'
import { useRoute, useRouter } from 'vue-router'
import { LongDate } from '@/utils/long_date'
import { Level } from '@/database/interface/level'
import { getParameterOfRoute } from '@/utils/route_utils'
import SearchInput from './program/SearchInput.vue'

const router = useRouter()

enum Sort {
  PUBLICATION_DATE = 'Par date',
  ALPHABETICAL = 'Alphabétique',
}

const deposits: Ref<Array<Repository>> = ref([])

const loading = ref(true)
databaseClient.getDeposits().then((result) => {
  deposits.value = result
  loading.value = false
})

const reversed = ref(false)
const sort = ref(Sort.PUBLICATION_DATE)
const selectedLevel: Ref<Level | null> = ref(
  Level.levelFromNameInURL(getParameterOfRoute(useRoute().params.level)),
)
const searchbarContent: Ref<string> = ref('')

function changeOrder() {
  reversed.value = !reversed.value
}

function changeSort(newKey: Sort) {
  console.log(sort.value, newKey)
  sort.value = newKey
}

function selectLevel(newLevel: Level) {
  console.log('Selected level', newLevel)
  selectedLevel.value = newLevel
}

const output = computed(() => {
  const reverseCoef = reversed.value ? -1 : 1

  let selectedData = []
  // If a level is selected, filter deposits
  if (selectedLevel.value != null) {
    selectedData = deposits.value.filter(
      (deposit) => deposit.level == selectedLevel.value,
    )
  } else {
    selectedData = deposits.value
  }

  selectedData = selectedData.filter((deposit) =>
    deposit.title.includes(searchbarContent.value),
  )

  switch (sort.value) {
    case Sort.ALPHABETICAL:
      return selectedData.sort(
        (a, b) => reverseCoef * a.title.localeCompare(b.title),
      )
    case Sort.PUBLICATION_DATE:
      return selectedData.sort(
        (a, b) =>
          reverseCoef *
          LongDate.compare(
            LongDate.ISOStringToLongDate(a.publication_date),
            LongDate.ISOStringToLongDate(b.publication_date),
          ),
      )
    default:
      throw Error('Unknown sort')
  }
})

const levels = computed(() => {
  const levels: Set<Level> = new Set()
  deposits.value.forEach((deposit) => levels.add(deposit.level))
  return Array.from(levels).sort((a, b) => a.index - b.index)
})
</script>

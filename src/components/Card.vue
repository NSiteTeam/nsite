<script setup lang="ts">
import { LongDate } from '@/utils/long_date'

const props = defineProps(['exercise'])
const repo = props.exercise
</script>

<template>
  <RouterLink
    :to="'/repository/content/' + repo.id"
    class="flex-col rounded-xl w-64 m-4 flex bg-primary p-8 text-white shadow-xl"
  >
    <h3 class="text-xl font-bold">{{ repo.title }}</h3>
    <i>
      Niveau: {{ repo.level.fullName }} • Ajouté le
      {{ LongDate.ISOStringToLongDate(repo.publication_date).beautify() }}
    </i>
    <p class="card-descr">{{ repo.description }}</p>
  </RouterLink>
</template>

<script setup lang="ts">
import { LongDate } from '@/utils/long_date'

const props = defineProps(['exercise'])
const repo = props.exercise //<!-- TODO: Rename-->
</script>

<template>
  <RouterLink :to="'/repository/content/' + repo.id" class="card">
    <h3 class="card-title">{{ repo.title }}</h3>
    <i>
      Niveau: {{ repo.level.fullName }} • Ajouté le
      {{ LongDate.ISOStringToLongDate(repo.publication_date).beautify() }}
    </i>
    <p class="card-descr">{{ repo.description }}</p>
  </RouterLink>
</template>

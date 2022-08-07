<template>
  <div class="m-8">
    <LargeTitle primary>{{ data.title }}</LargeTitle>
    <SmallTitle>{{ data.subtitle }}</SmallTitle>
    <div class="text-lg">{{ data.content }}</div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import SmallTitle from '../components/style/SmallTitle.vue'
// @ts-ignore
import LargeTitle from '@/components/style/LargeTitle.vue'
import { ref } from 'vue'
import { databaseClient } from '@/database/implementation'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id as string
const data = ref()

data.value = await databaseClient.fetchOneHistoryPoint(parseInt(id))
</script>

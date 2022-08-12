<template>
  <div class="m-8">
    <LargeTitle primary>{{ data.title }}</LargeTitle>
    <SmallTitle>{{ data.subtitle }}</SmallTitle>
    <img
      class="float-left h-40 p-4"
      v-if="data.imageUrls[0]"
      :src="data.imageUrls[0]"
      alt="image contenue dans l'article"
    />
    <img
      class="float-right h-40 p-4"
      v-if="data.imageUrls[1]"
      :src="data.imageUrls[1]"
      alt="image contenue dans l'article"
    />
    <div class="text-lg">{{ data.content }}</div>
    <img
      class="float-right h-64 p-4"
      v-for="(url, index) in data.imageUrls.slice(2)"
      :key="index"
      :src="url"
      alt="image contenue dans l'article"
    />
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

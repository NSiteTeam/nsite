<template>
  <div class="m-8">
    <LargeTitle primary>{{ data.title }}</LargeTitle>
    <img :src="data.imageUrls[0]" class="float-left max-h-64 w-auto p-2" />
    <MediumTitle>{{ data.subtitle }}</MediumTitle>
    <div class="text-lg">{{ data.content }}</div>
    <img
      v-for="(image, index) in data.imageUrls.slice(1)"
      :key="index"
      :src="image"
      class="float-left h-64 p-2"
    />
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import MediumTitle from '../components/style/MediumTitle.vue'
// @ts-ignore
import LargeTitle from '@/components/style/LargeTitle.vue'
import { ref } from 'vue'
import { databaseClient } from '@/database/implementation'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id as string
const data = ref()

data.value = await databaseClient.fetchOneNew(parseInt(id))
</script>

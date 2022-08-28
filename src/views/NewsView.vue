<template>
  <div class="m-8">
    <LargeTitle primary>{{ data.title }}</LargeTitle>
    <div 
      v-if="data.images.length"
      class="float-left font-bold w-64 p-2 break-words"
    >
      <img 
        v-if="data.images.length"
        class="w-64"
        :src="data.images[0].url"
      />
      {{ data.images[0].label }}
    </div>
    <MediumTitle>{{ data.subtitle }}</MediumTitle>
    <div class="text-lg">{{ data.content }}</div>
    <div class="float-left flex flex-col font-bold" :key="index" v-for="(image, index) in data.images.slice(1)">
      <img
        :src="image.url"
        class="max-h-64 p-2"
      />
      {{ image.label }}
    </div>
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

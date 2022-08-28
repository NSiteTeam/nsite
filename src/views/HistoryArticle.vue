<template>
  <div class="m-8 max-w-full">
    <LargeTitle primary>{{ data.title }}</LargeTitle>
    <SmallTitle>{{ data.subtitle }}</SmallTitle>
    <div v-if="data.images.length" class="float-left flex flex-col p-4 text-gray-800">
      <img
        class="h-40"
        :src="data.images[0].url"
        alt="Image contenue dans l'article"
      />
      <div class="font-bold">
        {{ data.images[0].label }}
      </div>
    </div>
    <div class="child:max-w-80 float-right flex w-1/2 flex-wrap pl-10">
      <div
        class="float-left flex flex-col font-bold p-4 text-gray-800"
        v-for="(image, index) in data.images.slice(1)"
        :key="index"
      >
        <img
          class="h-40"
          v-if="data.images.length"
          :src="image.url"
          alt="Image contenue dans l'article"
        />
        <div class="font-bold">
          {{ image.label }}
        </div>
      </div>
    </div>
    <Markdown class="w-full" :rawText="data.content" />
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import SmallTitle from '../components/style/SmallTitle.vue'
// @ts-ignore
import LargeTitle from '@/components/style/LargeTitle.vue'
// @ts-ignore
import Markdown from '@/components/style/Markdown.vue'
import { ref } from 'vue'
import { databaseClient } from '@/database/implementation'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id as string
const data = ref()

data.value = await databaseClient.fetchOneHistoryPoint(parseInt(id))
</script>

<script setup lang="ts">
import { databaseClient } from '@/database/implementation'
import type CustomFile from '@/database/interface/file'
import { LongDate } from '@/utils/long_date'
import type { Ref } from 'vue'
import { ref } from 'vue'

const { fileIds } = defineProps(['fileIds'])
const files: Ref<CustomFile[]> = ref([])

console.log(fileIds)
fileIds.map((fileID: string | number) => {
  console.log(Number(fileID))
  databaseClient.getFile(Number(fileID)).then((res) => files.value.push(res))
})
</script>

<template>
  <div class="m-8 flex w-full flex-wrap">
    <a
      v-for="file in files"
      :key="file.id"
      class="m-4 flex w-full items-center justify-between rounded-xl p-2 font-bold shadow-xl shadow-black/30 outline-primary"
      target="_blank"
      :href="file.file_url"
    >
      <span class="flex items-center p-4">
        <span class="material-icons mx-2">
          {{ file.icon }}
        </span>
        <div class="">
          {{ file.name }}
        </div>
      </span>
      <div>
        <span>
          {{ file.last_commit_author }}
        </span>
        :
        {{ file.last_commit_text }}
      </div>
      <span class="px-4">{{
        LongDate.ISOStringToLongDate(file.date).beautify()
      }}</span>
    </a>
  </div>
</template>

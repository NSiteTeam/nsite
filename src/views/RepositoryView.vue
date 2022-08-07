<script setup lang="ts">
// @ts-ignore
import Files from '../components/Files.vue'
import type { Repository } from '@/database/interface/repositories'
import { databaseClient } from '@/database/implementation'
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import type { Ref } from 'vue'
import type CustomFile from '@/database/interface/file'
import SupabaseMessage from '@/database/supabase/supabase_message'
import { LongDate } from '@/utils/long_date'

const id = Number(useRoute().params.id)
const files: Ref<CustomFile[]> = databaseClient.files
const repoData: Ref<Repository | null> = ref(null)
await databaseClient.getDeposit(id).then((res) => {
  repoData.value = res
})
</script>

<template>
  <!-- ensemble -->
  <div class="p-4">
    <h3 class="font-bold">
      <div class="text-4xl text-primary">{{ repoData.title }}</div>
      <i>
        <div>
          Niveau : {{ repoData.level.fullName }},
          {{
            LongDate.ISOStringToLongDate(repoData.publication_date).beautify(
              false,
            )
          }}
        </div>
      </i>
    </h3>
    <div id="repo-body" v-if="useRoute().params.content == 'content'">
      <div class="h-64 rounded-2xl p-8 m-8 text-lg shadow-2xl shadow-black/70">
        <h4 class="text-2xl font-bold">Description</h4>
        {{ repoData.description }}
      </div>
      <Files :fileIds="repoData.content" />
    </div>
  </div>
</template>

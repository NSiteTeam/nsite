<script setup lang="ts">
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { computed } from 'vue'

const { rawText } = defineProps(['rawText'])

const parsedMarkdown = computed(() =>
  DOMPurify.sanitize(marked.parse(rawText ?? ''), false),
)
</script>

<template>
  <div
    class="prose h-64 w-fit overflow-y-scroll pl-4"
    v-html="parsedMarkdown"
  ></div>
</template>

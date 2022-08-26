<script setup lang="ts">
import DOMPurify from 'dompurify'
import { marked } from 'marked'

const { rawText } = defineProps(['rawText'])

function parseMarkdown(text: string) {
  return DOMPurify.sanitize(marked.parse(text ?? ''), false)
}

</script>

<template>
  <div
    class="prose w-full"
    v-html="parseMarkdown(rawText)"
  ></div>
</template>

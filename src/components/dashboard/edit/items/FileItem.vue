<script setup lang='ts'>
    import { databaseClient } from '@/database/implementation'
    import type CustomFile from '@/database/interface/file'
    import type { Ref } from 'vue'
    import { ref } from 'vue'

    const { fileId } = defineProps(['fileId'])
    const file: Ref<CustomFile | null> = ref(null)
    const error: Ref<CustomFile | null> = ref(null)
    await databaseClient.getFile(fileId)
    .then(res => file.value = res)
    .catch(res => file.value = res)
    const success: Ref<boolean> = ref(file.value ? true : false)
</script>

<template>
    <div>
        {{ file }}
    </div>
</template>
<script setup lang="ts">
    import { databaseClient } from '@/database/implementation';
    import CustomDate from '@/utils/classes/CustomDate';
    import type { Ref } from 'vue';
    import { ref } from 'vue';

    const { fileIds } = defineProps(['fileIds'])
    console.log(fileIds)
    databaseClient.clearFiles()
    fileIds.map((fileID: string | number) => {
        databaseClient.getFile(Number(fileID))
    })
    const files = databaseClient.files.value
</script>

<template>
    <div id="repo-content">
        <div class="repo-content-row" v-for="data in files" :key="data.id">
            <span class="file-title">
                <span class="material-icons">
                    {{ data.icon }}
                </span>
                <div class="file-title-name">
                    {{ data.name }}
                </div>
            </span>
            <div class="file-last-commit">
                <span class="file-last-commit-author">
                    {{ data.last_commit_author }}
                </span> :
                {{ data.last_commit_text }}
            </div>
            <span class="date">{{ CustomDate.ISOStringToCustomDate(data.date).beautify() }}</span>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { databaseClient } from '@/database/implementation';
    import CustomDate from '@/utils/classes/CustomDate';
    import type { Ref } from 'vue';
    import { ref } from 'vue';

    const { fileIds } = defineProps(['fileIds'])

    databaseClient.clearFiles()
    fileIds.map((fileID: string | number) => {
        databaseClient.getFile(Number(fileID))
    })
    const files = databaseClient.files.value
</script>

<template>
    <div id="repo-content">
        <div class="repo-content-row" v-for="file in files" :key="file.id">
            <a target="_blank" :href="file.file_url">
                <span class="file-title">
                    <span class="material-icons">
                        {{ file.icon }}
                    </span>
                    <div class="file-title-name">
                        {{ file.name }}
                    </div>
                </span>
                <div class="file-last-commit">
                    <span class="file-last-commit-author">
                        {{ file.last_commit_author }}
                    </span> :
                    {{ file.last_commit_text }}
                </div>
                <span class="date">{{ CustomDate.ISOStringToCustomDate(file.date).beautify() }}</span>
            </a>
        </div>
    </div>
</template>
<script setup lang='ts'>
    import { databaseClient } from '@/database/implementation'
    import type CustomFile from '@/database/interface/file'
    import type { Ref } from 'vue'
    import { ref } from 'vue'

    const { fileId } = defineProps(['fileId'])

    const file: Ref<CustomFile | null> = ref(null)
    const error: Ref<CustomFile | null> = ref(null)
    const edit = ref(false)

    await databaseClient.getFile(fileId)
    .then(res => file.value = res)
    .catch(res => error.value = res)
    const success: Ref<boolean> = ref(file.value ? true : false)

    function toggleEdit() {
        edit.value = !edit.value
    }
</script>

<template>
    <div class="file">
        <div class="file-name">
            <span @click="toggleEdit()" class="material-symbols-sharp">
                {{ edit ? 'done' : 'edit' }}
            </span>
            <p class="file-name-label" v-if="!edit">
                {{ file.name }}
            </p>
            <input v-if="edit" type="text" v-model="file.name" name="file-name" id="file-name" />
        </div>
        <div class="file-message">
            <div class="file-message-author">
                {{ file.last_commit_author }}
            </div> : 
            {{ file.last_commit_text }}
        </div>
    </div>
</template>
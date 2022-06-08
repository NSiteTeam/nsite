<script setup lang='ts'>
    import { databaseClient } from '@/database/implementation'
    import { LongDate } from '@/utils/long_date'
    import type CustomFile from '@/database/interface/file'
    import type { Ref } from 'vue'
    import { ref } from 'vue'

    const { file } = defineProps(['file'])

    const error: Ref<CustomFile | null> = ref(null)
    const edit = ref(false)

    function toggleEdit() {
        edit.value = !edit.value

        if (!edit.value) {
            databaseClient.renameFile(file.id, file.name,
            file.last_commit_author)
        }
    }
</script>

<template>
    <div class="file">
        <div class="file-name">
            <span @click="toggleEdit()" class="material-icons">
                {{ edit ? 'done' : 'edit' }}
            </span>
            <p class="file-name-label" v-if="!edit">
                {{ file.name }}
            </p>
            <input v-if="edit" type="text" v-model="file.name" name="file-name" id="file-name" />
        </div>
        <div class="file-date">
            {{ LongDate.ISOStringToLongDate(file.date).beautify() }}
        </div>
        <div class="file-message">
            <div class="file-message-author">
                {{ file.last_commit_author }}
            </div> :&nbsp;
            <input v-if="edit" type="text" v-model="file.last_commit_text" 
            name="file-name" id="file-name" />
            <div v-if="!edit">{{ file.last_commit_text }}</div>
        </div>
    </div>
</template>
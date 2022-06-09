<script setup lang='ts'>
    import { databaseClient } from '@/database/implementation'
    import { LongDate } from '@/utils/long_date'
    import type CustomFile from '@/database/interface/file'
    import type { Ref } from 'vue'
    import { ref } from 'vue'

    const { file } = defineProps(['file'])
    const emit = defineEmits(['deleted'])

    const error: Ref<CustomFile | null> = ref(null)
    const deleteSuccess = ref(false)
    const deleteLoading = ref(false)
    const deleteError: Ref<string | null> = ref(null)
    const edit = ref(false)

    function toggleEdit() {
        edit.value = !edit.value

        if (!edit.value) {
            databaseClient.renameFile(file.id, file.name,
            file.last_commit_author)
        }
    }

    async function deleteFile() {
        deleteLoading.value = true
        await databaseClient.deleteFile(file.id)
        .then(_ => {
            deleteSuccess.value = true
            emit('deleted')
        })
        .catch(res => {
            deleteError.value = res
        })
        deleteLoading.value = false
        setTimeout(_ =>
            [deleteSuccess.value, deleteLoading.value, deleteError.value] = [false, false, null],
        3000)
    }
</script>

<template>
    <div class="good" v-if="deleteSuccess">Le fichier a bien été supprimé</div>
    <div class="indication" v-if="deleteLoading">Supression en cours</div>
    <div class="error" v-if="deleteError">{{ deleteError }}</div>
    <div class="file">
        <div class="file-name">
            <a :href="file.file_url" target="_blank" class="material-icons icon">
                visibility
            </a>
            <span @click="toggleEdit()" class="material-icons icon">
                {{ edit ? 'done' : 'edit' }}
            </span>
            <span @click="deleteFile()" class="material-icons icon">
                delete
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
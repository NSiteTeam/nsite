<template>
    <DataColumn
        @createData='addNews'
        title='Actualités'
        add-button-message='Ajouter une actualité'
        :list='news'
        :to-text='(i) => i + 1'
        :to-key='(i) => i'
    />
</template>

<script setup lang='ts'>
    import DataColumn from '@/components/dashboaard/DataColumn.vue'
    import { DataSection } from '@/utils/data_section'
    import { ref } from 'vue'

    const news = ref([new DataSection('Catégorie 1', [1, 2, 3]), "Autre"])

    function addNews() {
        console.log("Hi")
    }
</script>

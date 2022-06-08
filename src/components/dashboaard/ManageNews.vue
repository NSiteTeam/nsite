<template>
    <DataColumn
        @createData='addNews'
        title='Actualités'
        add-button-message='Ajouter une actualité'
        :list='news'
        :to-text='newsToText'
        :to-key='newsToKey'
    />
    <ContextMenu>
        <ContextMenuElement icon='visibility' message='Option 1'/>
        <ContextMenuElement icon='visibility' message='Option 2' />
        <ContextMenuElement icon='visibility' message='Option 3' />
        <ContextMenuSeparator />
        <ContextMenuElement icon='visibility' message='Option 4' />
    </ContextMenu>
</template>

<script setup lang='ts'>
    import DataColumn from '@/components/dashboaard/DataColumn.vue'
    import { databaseClient } from '@/database/implementation'
    import type { News } from '@/database/interface/news'
    import { DataSection } from '@/utils/data_section'
    import { ref } from 'vue'
    import type { Ref } from 'vue'
    import ContextMenu from '@/components/dashboaard/context_menu/ContextMenu.vue'
    import ContextMenuSeparator from '@/components/dashboaard/context_menu/ContextMenuSeparator.vue'
    import ContextMenuElement from '@/components/dashboaard/context_menu/ContextMenuElement.vue'

    const NEWS_BATCH_SIZE = 20

    // TODO: Add categories to news (sort by year ?)
    const news: Ref<News[]> = databaseClient.fetchedNews

    function addNews() {
        console.log("Hi")
    }

    function newsToText(news: News) {
        return news.title
    }

    function newsToKey(news: News) {
        return news.id
    }

    databaseClient.fetchNews(NEWS_BATCH_SIZE)
</script>

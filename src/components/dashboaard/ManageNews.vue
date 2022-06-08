<template>
    <DataColumn
        @createData='addNews'
        title='Actualités'
        add-button-message='Ajouter une actualité'
        :list='news'
        :to-text='newsToText'
        :to-key='newsToKey'
    >
        <template v-slot='slotProps'>
            {{ slotProps.text }}
            <ContextMenu>
                <ContextMenuElement
                    :icon='slotProps.data.visible ? "visibility_off" : "visibility"'
                    :message='slotProps.data.visible ? "Cacher" : "Montrer"'
                />
            </ContextMenu>
        </template>
    </DataColumn>
</template>

<script setup lang='ts'>
    import DataColumn from '@/components/dashboaard/DataColumn.vue'
    import { databaseClient } from '@/database/implementation'
    import type { News } from '@/database/interface/news'
    import { DataSection } from '@/utils/data_section'
    import { computed, ref } from 'vue'
    import type { Ref } from 'vue'
    import ContextMenu from '@/components/dashboaard/context_menu/ContextMenu.vue'
    import ContextMenuSeparator from '@/components/dashboaard/context_menu/ContextMenuSeparator.vue'
    import ContextMenuElement from '@/components/dashboaard/context_menu/ContextMenuElement.vue'

    const NEWS_BATCH_SIZE = 20

    // TODO: Add categories to news (sort by year ?)
    const news = computed(
        () => DataSection.makeSections(databaseClient.fetchedNews.value, (news) => news.visible ? 'Visibles' : 'Cachées', ['Visibles', 'Cachées'])
    )

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

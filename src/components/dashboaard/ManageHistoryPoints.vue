<template>
    <div :class="messageClass" v-if="message">{{ message }}</div>

    <DataColumn
        @createData='addHistoryPoint'
        @selectData='selectHistoryPoint'
        title="Points d'histoire"
        add-button-message="Nouveau point d'histoire"
        :list='historyPoint'
        :to-text='historyPointToText'
        :to-key='historyPointToKey'
    >
        <template v-slot='slotProps'>
            {{ slotProps.text }}
            <ContextMenu>
                <ContextMenuElement
                    :icon='slotProps.data.visible ? "visibility_off" : "visibility"'
                    :message='slotProps.data.visible ? "Cacher" : "Montrer"'
                    @click.prevent='switchVisibilityOfHistoryPoint(slotProps.data)'
                />
                <ContextMenuElement
                    icon='delete'
                    message='Supprimer'
                    @click.prevent='deleteHistoryPoint(slotProps.data)'
                />
            </ContextMenu>
        </template>
    </DataColumn>

    <div v-if='!selectedHistoryPoint' class="center-text">
        <span>Aucun point d'histoire n'est séléctionné</span>
    </div>
    <div v-else id='form-center'>
        <form  id='history-point-form-container' @submit='save'>
            <div id="history-point-form-title-container">
                <label id='history-point-title-label' for="history-point-form-title">Titre</label>
                <input id='history-point-form-title' v-model.trim='selectedHistoryPoint.title' placeholder="Invention des mathématiques">
                <input type='date' :value='selectedHistoryPoint.date.toForm()' @input='setDate'>
            </div>
            <textarea v-model.trim="selectedHistoryPoint.content" id='history-point-textarea' placeholder="L'origine des mathématiques se trouve en Orient. Là-bas, les premiers mathématiciens..."></textarea>
            <div id='submit-row'>
                <input @click.prevent="saveHistoryPoint" id='submit-button' type='button' value="Sauvegarder">
            </div>
        </form>
    </div>
</template>

<script setup lang='ts'>
    import DataColumn from '@/components/dashboaard/DataColumn.vue'
    import { databaseClient } from '@/database/implementation'
    import type { HistoryPoint } from '@/database/interface/historyPoint'
    import { DataSection } from '@/utils/data_section'
    import { computed, ref } from 'vue'
    import type { Ref } from 'vue'
    import ContextMenu from '@/components/dashboaard/context_menu/ContextMenu.vue'
    import ContextMenuSeparator from '@/components/dashboaard/context_menu/ContextMenuSeparator.vue'
    import ContextMenuElement from '@/components/dashboaard/context_menu/ContextMenuElement.vue'
    import { Level } from '@/database/interface/level'
    import { LongDate } from '@/utils/long_date'
    import { MessageType } from '@/utils/message_type'

    const selectedHistoryPoint: Ref<HistoryPoint | null> = ref(null)

    const message = ref("")
    const messageClass = ref(MessageType.INDICATION)

    const historyPoint = computed(
        () => DataSection.makeSections(
            databaseClient.fetchedHistoryPoints.value,
            (historyPoint) => historyPoint.visible ? 'Visibles' : 'Brouillons',
            (section) => ['Visibles', 'Brouillons'].indexOf(section.name)
        )
    )
    async function addHistoryPoint() {
        const title = prompt('Titre')
        if (title) {
            const historyPoint = await databaseClient.createEmptyHistoryPoint(title)
            selectedHistoryPoint.value = historyPoint
        }
    }

    function selectHistoryPoint(historyPoint: HistoryPoint) {
        selectedHistoryPoint.value = historyPoint
    }

    function switchVisibilityOfHistoryPoint(historyPoint: HistoryPoint) {
        databaseClient.switchVisibilityOfHistoryPoint(historyPoint)
    }

    function historyPointToText(historyPoint: HistoryPoint) {
        return historyPoint.title
    }

    function historyPointToKey(historyPoint: HistoryPoint) {
        return historyPoint
    }

    function setDate(value: any) {
        selectedHistoryPoint.value!.date = LongDate.fromForm(value.srcElement.value)
    }

    async function saveHistoryPoint(event: MouseEvent) {
        message.value = 'Point d\'histoire en cours de sauvegarde'
        messageClass.value = MessageType.INDICATION

        const error = await databaseClient.updateHistoryPoint(selectedHistoryPoint.value!)

        if (error) {
            message.value = error
            messageClass.value = MessageType.ERROR
        } else {
            message.value = 'Le point d\'histoire a été sauvegardé avec succès'
            messageClass.value = MessageType.GOOD
        }

        setTimeout(() => message.value = '', 2000)
    }

    function deleteHistoryPoint(historyPoint: HistoryPoint) {
        if (confirm("Etes-vous sûr de vouloir supprimer ce point d'histoire ?")) {
            databaseClient.deleteHistoryPoint(historyPoint)
            selectedHistoryPoint.value = null
        }
    }

    databaseClient.fetchHistoryPoints()
</script>

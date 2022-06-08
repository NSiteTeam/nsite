<script setup lang="ts">
import { databaseClient } from "@/database/implementation"
import type { Ref } from "vue"
import { ref } from "vue"
    
import DataColumn from '/workspace/nsite/src/components/dashboaard/DataColumn.vue'
import {shallowRef} from "vue";
import type { HistoryPoint } from "@/database/interface/history_point"
import { LongDate } from "/workspace/nsite/src/utils/long_date"
import { timestampToFrenchDate } from "@/utils/date"

    const historyPoints: Ref<Array<HistoryPoint>> = ref([])
    databaseClient.getHistoryPoints().then(res =>
        historyPoints.value = res
    ).catch(error => {
        throw error
    })

    function formatDate(ISOtimestamp: string): string {
        const timestamp: Array<number> = ISOtimestamp.split("-").map(digit => {
            return Number(digit)
        })
        const date = new LongDate(0, 0, 0, timestamp[2], timestamp[1], timestamp[0])
        return date.beautify()
    }

const deposits: Ref<DataSection<Repository>[]> = shallowRef([])


const title: Ref<string> = ref("")
const content: Ref<string> = ref("")
const date: Ref<string> = ref("")
const submitted: Ref<boolean> = ref(false)

function handleSubmit() {
    databaseClient.postHistotyPoint(title.value, content.value, date.value)
    .then(_ => submitted.value = true)
}
</script>

<template>

    <DataColumn
        title="Points d'Histoire existants: "
        add-button-message="Ajouter un point d'Histoire: "
        :list='deposits'>

        <div class="container">
        <div v-if='!historyPoints.length' class='loading-container'>
            <LoadingAnimation size="25%"/>
        </div>
        <ul>
            <li v-for="(history, index) in historyPoints" :key="index">
                <span class="number">
                    <span>{{ formatDate(history.date) }}</span>
                </span>
                <div class="bd">
                    <div class="title">{{ history.title }}</div>
                    <div class="info">{{ history.content }}</div>
                </div>
            </li>
        </ul>
    </div>
    </DataColumn>>

    <div class="submitted" v-if="submitted">
    Le point d'histoire à été ajouté à la base de données
    </div>
    
    <div class="add-news" v-else>
        <h3>Ajouter un point d'histoire</h3>
        <label for="title">
            <h3>Titre</h3>
        </label>
        <input v-model="title" id="title" type="text" placeholder="Titre">
        <label for="content">
            <h3>Contenu</h3>
        </label>
        <textarea v-model="content" id="content" type="text" placeholder="Contenu">
        </textarea>
        <label for="date">
            <h3>Date</h3>
        </label>
        <input v-model="date" id="date" type="text" placeholder="Date">
        <button class="submit" @click="handleSubmit()">Envoyer</button>
    </div>
</template>
<script setup lang="ts">
    import { databaseClient } from "@/database/implementation"
    import type { HistoryPoint } from "@/database/interface/history_point"
    import { LongDate } from "../utils/long_date"
    import type date from "../utils/interface/date"
    import { timestampToFrenchDate } from "@/utils/date"
    import type { Ref } from "vue"
    import { ref } from "vue"

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
</script>

<template>
    <div class="container">
        <h2>Petite histoire des mathématiques :</h2>
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
</template>


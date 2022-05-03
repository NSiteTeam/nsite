<script setup lang="ts">
</script>

<template>
    <div class="container">
        <ul>
            <li v-for="(history, index) in historyPoints" :key="index">
                <span class="number">
                    <span>{{ history.date }}</span>
                </span>
                <div class="bd">
                    <div class="title">{{ history.title }}</div>
                    <div class="info">{{ history.content }}</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { databaseClient } from "@/database/implementation";
    import type { HistoryPoint } from "@/database/interface/history_point";
    import { timestampToFrenchDate } from "@/utils/date";
    import type { Ref } from "vue";
    import { ref } from "vue";

    const historyPoints: Ref<Array<History>> = ref([])

    databaseClient.getTimeline(history => {
        console.log(history)
        historyPoints.value = history.sort((a: HistoryPoint, b: HistoryPoint) => {
            
            return a.index - b.index
        })
    })

    function formatDate(ISOtimestamp: string): string {
        return timestampToFrenchDate(ISOtimestamp)
    }
</script>
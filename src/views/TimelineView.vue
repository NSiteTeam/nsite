<script setup lang="ts">
    import { databaseClient } from "@/database/implementation";
    import type { HistoryPoint } from "@/database/interface/history_point";
    import { timestampToFrenchDate } from "@/utils/date";
    import type { Ref } from "vue";
    import { ref } from "vue";

    const historyPoints: Ref<Array<HistoryPoint>> = ref([])
    databaseClient.getHistoryPoints().then(res =>
        historyPoints.value = res
    ).catch(error => {
        throw error
    })

    function formatDate(ISOtimestamp: string): string {
        return timestampToFrenchDate(ISOtimestamp)
    }
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


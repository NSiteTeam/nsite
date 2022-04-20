<script setup lang="ts">
</script>

<template>
    <div class="container">
        <ul>
            <li v-for="(history, index) in historyRef" :key="index">
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
    import type { History } from "@/database/interface/history";
    import type { Ref } from "vue";
    import { ref } from "vue";

    const historyRef: Ref<Array<History>> = ref([])

    // @ts-ignore
    databaseClient.getTimeline(history => {
        historyRef.value = history.sort((a: History, b: History) => {
            // @ts-ignore
            return a.index - b.index
        })
    })

    function formatDate(ISOtimestamp: String): String {
      return ISOtimestamp.split("T")[0].split("-").reverse().join("/")
    }
</script>
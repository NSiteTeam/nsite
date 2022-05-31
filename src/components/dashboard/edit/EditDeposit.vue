<script setup lang="ts">
    // @ts-ignore Vue bug
    import DepoItem from "./items/DepoItem.vue"
    import type { Repository } from "@/database/interface/repositories";
    import { databaseClient } from "@/database/implementation";
    import { ref } from 'vue'
    import type { Ref } from 'vue'

    const deposits: Ref<Repository[]> = ref([])
    await databaseClient.getRepos().then(res => deposits.value = res)
</script>

<template>
    <div class="edit-deposit">
        <h3 class="edit-deposit-title">Modifier un dépôt de cours</h3>
        <DepoItem v-for="(depo, index) in deposits" :key="index" :depo="depo" />
    </div>
</template>

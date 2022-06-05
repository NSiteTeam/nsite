<script setup lang="ts">
    import { databaseClient } from "@/database/implementation";
    import type { Repository } from "@/database/interface/repositories";
    // @ts-ignore
    import FileItem from "@/components/dashboard/edit/items/FileItem.vue"
    import { watch, ref, toRaw, onMounted } from "vue";
    import type { Ref } from "vue";

    const depositTableIsExpanded = ref(true)
    const deposits = ref()
    const selectedDeposit = ref()
    const files: Ref<any[]> = ref([])

    await databaseClient.getOwnedDeposits().then(result => {
        deposits.value = result
        selectedDeposit.value = result[0]
    })

    function fetchFiles() {
        files.value = []
        selectedDeposit.value.content.map(async (fileId: number) => {
            const file = ref()
            await databaseClient.getFile(fileId)
            .then(res => file.value = res)
            files.value.push(toRaw(file.value))
        })
    }

    function flipDepositListExpansion() {
        depositTableIsExpanded.value = !depositTableIsExpanded.value
    }

    function selectDeposit(deposit: Repository) {
        selectedDeposit.value = deposit
    }
    onMounted(fetchFiles)
    watch(selectedDeposit, fetchFiles)
</script>

<template>
    <div id="manage-deposit">
        <div id="deposit-list" :class="{ 'hidden': !depositTableIsExpanded }">
            <h3 id="deposit-list-title">Vos depôts de ressources</h3>
            <span
                v-on:click='flipDepositListExpansion()'
                id="deposit-list-menu-icon"
                class="material-icons white"
                :class="{ 'horizontal-symmetry': depositTableIsExpanded }"
            >
                arrow_forward_ios
            </span>
            <ul id='deposit-names'>
                <li
                    class='deposit-list-element'
                    v-for="deposit in deposits"
                    :key="deposit"
                    :class="{ 'selected': deposit == selectedDeposit }"
                    v-on:click='selectDeposit(deposit)'
                >
                    {{ deposit.title }}
                </li>
                <li class='deposit-list-element' id="add-deposit-button">
                    <span class="material-icons white">
                        add
                    </span>
                    <span>
                        Créer un nouveau dépôt
                    </span>
                </li>
            </ul>
        </div>
    </div>
    <div class="files">
        <FileItem v-for="(file, index) in files" :key="index" :file="file" />
    </div>
</template>
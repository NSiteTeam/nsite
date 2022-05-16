<script setup lang="ts">
    import { databaseClient } from "@/database/implementation"
    import { computed, ref } from "vue"
    import type { Ref } from "vue"
    import type { Repository } from "@/database/interface/repositories"
    import Card from "@/components/Card.vue"
import CustomDate from "@/utils/classes/CustomDate"

    enum Sort {
        PUBLICATION_DATE = "Par date",
        ALPHABETICAL = "Alphabétique",
        LEVEL = "Par niveau"
    }

    const data: Ref<Array<Repository>> = ref([])

    databaseClient.getRepos().then(res =>
        data.value = res
    )


    const reversed = ref(false)
    const sort = ref(Sort.PUBLICATION_DATE)
    const selectedLevel: Ref<number | null> = ref(null)


    function changeOrder() {
        reversed.value = !reversed.value
    }

    function changeSort(newKey: Sort) {
        sort.value = newKey
    }

    function selectLevel(newLevel: number) {
        selectedLevel.value = newLevel
    }

    const output = computed(
        () => {
            const reverseCoef = reversed.value ? -1 : 1

            switch (sort.value) {
                case Sort.ALPHABETICAL:
                    return data.value.sort((a, b) => reverseCoef * a.title.localeCompare(b.title))
                case Sort.LEVEL:
                    return data.value.sort((a, b) => reverseCoef * (a.level - b.level))
                case Sort.PUBLICATION_DATE:
                    return CustomDate.sortDates(data.value, reversed.value)
                default:
                    throw Error('Unknown sort')
            }
        }
    )

    function levels(): Array<number> {
        const levels: Array<number> = []
        data.value.forEach(repo => {
            if(!(levels.includes(repo.level))) {
                levels.push(repo.level)
            }
        })
        return levels.sort((a, b) => {
            return b-a
        })
    }

</script>


<template>
    <h2>Type de tri :</h2>

    <ul class="sort-keys">
        <button class="change-order-button" @click="changeOrder()">
            <span v-if="reversed" class="material-icons">
                arrow_drop_up
            </span>
            <span v-else class="material-icons">
                arrow_drop_down
            </span>
            Changer l'ordre
        </button>

        <li
            @click="changeSort(Sort.ALPHABETICAL)"
            v-bind:class="{ 'active': sort == Sort.ALPHABETICAL }"
            v-for="sortType in Sort"
            :key="sortType"
        >
            {{ sortType }}
        </li>

        <li
            :v-bind:class="{ 'active': selectedLevel == -1 }"
            class="level-button-all" @click="selectLevel(-1)"
        >
            Tout
        </li>

        <li
            v-bind:class="{ 'active': level == selectedLevel }"
            class="level-button"
            @click="selectLevel(level)"
            v-for="level in levels"
            :key="level"
        >
            {{ level }}
            <sup>ème</sup> <!--TODO: Use table join-->
        </li>
    </ul>

    <h2>Résultats :</h2>

    <div id="browse-container">
        <Card :exercise=repo v-for="repo in output" :key="repo.id" />
    </div>

</template>
 <script setup lang="ts">
import { databaseClient } from "@/database/implementation"
import { computed, ref } from "vue"
import type { Ref } from "vue"
import type { Repository } from "@/database/interface/repositories"
// @ts-ignore C'est un bug
import Card from "@/components/Card.vue"
import { useRoute } from "vue-router"
import CustomDate from "@/utils/classes/CustomDate"

enum Sort {
    PUBLICATION_DATE = "Par date",
    ALPHABETICAL = "Alphabétique"
}

const data: Ref<Array<Repository>> = ref([])

databaseClient.getRepos().then(res =>
    data.value = res
)

const reversed = ref(false)
const sort = ref(Sort.PUBLICATION_DATE)
const selectedLevel: Ref<number | null> = ref(
    useRoute().params.level[0] ? Number(useRoute().params.level[0]) : null
)
const searchbarContent: Ref<string> = ref("")


function changeOrder() {
    reversed.value = !reversed.value
}

function changeSort(newKey: Sort) {
    console.log(sort.value, newKey)
    sort.value = newKey
}

function selectLevel(newLevel: number) {
    console.log(selectedLevel.value)
    selectedLevel.value = newLevel
}

const output = computed(
    () => {
        const reverseCoef = reversed.value ? -1 : 1

        const selectedData: Ref<Repository[]> = ref([])
        // If a level is selected, sort depos
        if (selectedLevel.value != null) {
            selectedData.value = data.value.filter(deposit => {
                return deposit.level == selectedLevel.value
            })
        } else {
            selectedData.value = data.value
        }

        selectedData.value =selectedData.value.filter(deposit => {
            return deposit.title.includes(searchbarContent.value)
        })

        switch (sort.value) {
            case Sort.ALPHABETICAL:
                return selectedData.value.sort((a, b) => reverseCoef * a.title.localeCompare(b.title))
            case Sort.PUBLICATION_DATE:
                return selectedData.value.sort((a, b) => CustomDate.subDates(
                    CustomDate.ISOStringToCustomDate(a.publication_date),
                    CustomDate.ISOStringToCustomDate(b.publication_date), reversed.value))
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
    <div class="search">
        <input type="text" v-model="searchbarContent" 
        autocomplete="off" name="search-input" 
        class="search-input" placeholder="Rechercher">
        <button class="material-icons white">
            search
        </button>
    </div>
    <div class="filters">
        <ul class="level-buttons">
            <h2>Niveaux :</h2>
            <li
                :class="(selectedLevel == null) ? 'active': ''"
                class="level-button-all" @click="selectLevel(null)"
            >
            <RouterLink to="/browse/">
                Tout
            </RouterLink>
            </li>
            <li
                v-bind:class="{ 'active': level == selectedLevel }"
                class="level-button"
                @click="selectLevel(level)"
                v-for="level in levels()"
                :key="level"
            >
            <RouterLink :to="'/browse/' + level">
                {{ level }}{{ level == 2 ? "nd" : "eme" }}
            </RouterLink>
            </li>
        </ul>
        
        <ul class="sort-keys">
            <h2>Type de tri :</h2>
            <button class="change-order-button" @click="changeOrder()">
                <span v-if="reversed" class="material-icons">
                    arrow_drop_up
                </span>
                <span v-else class="material-icons">
                    arrow_drop_down
                </span>
                Ordre {{ reversed ? "Croissant" : "Décroissant" }}
            </button>

            <li
                @click="changeSort(sortType)"
                v-bind:class="{ 'active': sort == sortType }"
                v-for="sortType in Sort"
                :key="sortType"
            >
                {{ sortType }}
            </li>
        </ul>
    </div>
    <h2>Résultats :</h2>
    <Transition name="fade">
        <div id="browse-container">
            <Card :exercise=repo v-for="repo in output" :key="repo.id" />
        </div>
    </Transition>
</template>
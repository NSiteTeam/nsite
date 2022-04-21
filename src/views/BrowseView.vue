<script setup lang="ts">
import Card from "./../components/Card.vue"
import { computed } from 'vue'
import data from "../data.json"
import type { Ref } from 'vue';
import { ref } from 'vue';

function sort_data(data: Array<object>) {
    if (key.value == "title") {
        return data.sort((a, b) => {
            // @ts-ignore
            return reverse.value * a.title.localeCompare(b.title)
        })
    }
    if (selected_level.value == -1){
        return data.sort((a, b) => {
            // @ts-ignore
            return reverse.value * (a[key.value] - b[key.value])
        })
    } else {
        return data.sort((a, b) => {
            // @ts-ignore
            return reverse.value * (a[key.value] - b[key.value])
        }).filter(repo => {
            // @ts-ignore
            return repo.level == selected_level.value
        })
    }
}

function levels_func() {
    const levels: Array<number> = []
    data.forEach(repo => {
        if(!(levels.includes(repo.level))) {
            levels.push(repo.level)
        }
    })
    return levels.sort((a, b) => {
        return b-a
    })
}

function changeOrder() {
    reverse.value = -1 * reverse.value
}

function changeKey(new_key: String) {
    key.value = new_key
}

function selectLevel(level: number) {
    selected_level.value = level
}

const output = computed(_ => {
    return sort_data(data)
})

const levels = computed(_ => {
    return levels_func()
})

const reverse: Ref<number> = ref(-1)
const key: Ref<String> = ref("publication_date")
const selected_level: Ref<number> = ref(-1)
const sortKeys = {
    publication_date: "Par date",
    title: "Alphabétique",
    level: "Par niveau"
}
</script>


<template>
    <h2>Type de tri :</h2>
    <ul class="sort-keys">
        <button class="change-order-button" @click="changeOrder()">
            <span v-if="reverse == 1" class="material-icons">
                arrow_drop_up
            </span>
            <span v-else class="material-icons">
                arrow_drop_down
            </span>
            Changer l'ordre
        </button>
        <li @click="changeKey(sortKey[0])" 
        :class="key == sortKey[0] ? 'active' : ''" 
        v-for="sortKey in Object.entries(sortKeys)" 
        :key="sortKey">
            {{ sortKey[1] }}
        </li>
        <li :class="-1 == selected_level ? 'active' : ''" 
        class="level-button-all" @click="selectLevel(-1)">
            Tout
        </li>
        <li :class="level == selected_level ? 'active' : ''" 
        class="level-button" @click="selectLevel(level)" v-for="level in levels" :key="level">
            {{ level }}<sup>ème</sup>
        </li>
    </ul>
    <h2>Résultats :</h2>
    <div id="browse-container">
        <Card :data=repo v-for="repo in output" :key="repo.id" />
    </div>
</template>
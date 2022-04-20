<script lang="ts">
import Card from "./../components/Card.vue"
import data from "./../data.json"

export default {
    data() {
        return {
            reverse: -1,
            key: "publication_date",
            selected_level: -1,
            sort_keys: {
                publication_date: "Par date",
                title: "Alphabétique",
                level: "Par niveau"
            }
        }
    },
    methods: {
        changeOrder() {
            // @ts-ignore
            this.$data.reverse = this.$data.reverse * (-1)
        },
        changeKey(key: String) {
            // @ts-ignore
            this.$data.key = key
        },
        selectLevel(level: number) {
            // @ts-ignore
            this.$data.selected_level = level
        }
    },
    components: {
        Card
    },
    computed: {
        output(): Array<object> {
            // @ts-ignore
            if (this.$data.key == "title") {
                return data.sort((a, b) => {
                    // @ts-ignore
                    return this.$data.reverse * a.title.localeCompare(b.title)
                })
            }
            // @ts-ignore
            if (this.$data.selected_level == -1){
                return data.sort((a, b) => {
                    // @ts-ignore
                    return this.$data.reverse * (a[this.$data.key] - b[this.$data.key])
                })
            } else {
                return data.sort((a, b) => {
                    // @ts-ignore
                    return this.$data.reverse * (a[this.$data.key] - b[this.$data.key])
                }).filter(repo => {
                    // @ts-ignore
                    return repo.level == this.$data.selected_level
                })
            }
        },
        levels(): Array<number> {
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
    }
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
        v-for="sortKey in Object.entries(sort_keys)" 
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
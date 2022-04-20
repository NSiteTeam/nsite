<script lang="ts">
import Card from "./../components/Card.vue"
import data from "./../data.json"

export default {
    data() {
        return {
            reverse: -1,
            key: "publication_date",
            sort_keys: {
                publication_date: "date",
                title: "titre",
                level: "niveau"
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
            return data.sort((a, b) => {
                // @ts-ignore
                return this.$data.reverse * (a[this.$data.key] - b[this.$data.key])
            })
        }
    }
}

</script>


<template>
    <div class="sort-container">
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
            class="sort-key" :class="key == sortKey[0] ? 'active' : ''" 
            v-for="sortKey in Object.entries(sort_keys)" 
            :key="sortKey">
                <span :class="key == sortKey[0] ? 'selector' : ''">{{ key == sortKey[0] ? '•' : '' }}</span>
                {{ sortKey[1] }}
            </li>
        </ul>
    </div>
    <div id="browse-container">
        <Card :data=repo v-for="repo in output" :key="repo.id" />
    </div>
</template>
<script lang="ts">
import Card from "./../components/Card.vue"
import data from "./../data.json"

export default {
    data() {
        return {
            reverse: 1,
            key: "date"
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
            console.log(this.$data.reverse);
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
        <button class="change-order-button" @click="changeOrder()">Changer l'ordre</button>
        <ul class="sort-keys">
            <li :@click="changeKey(key)" class="sort-key" v-for="key in Object.keys(output[0])" :key="key">
                {{ key }}
            </li>
        </ul>
    </div>
    <div id="browse-container">
        <Card :data=repo v-for="repo in output" :key="repo.id" />
    </div>
</template>
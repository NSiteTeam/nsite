<script lang="ts">
import Card from "./../components/Card.vue"
import data from "./../data.json"

export default {
    data() {
        return {
            reverse: 1
        }
    },
    methods: {
        changeOrder() {
            // @ts-ignore
            this.$data.reverse = this.$data.reverse * (-1)
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
                return this.$data.reverse * (a.id - b.id)
            })
        }
    }
}

</script>


<template>
    <button class="change-order-button" @click="changeOrder()">Changer l'ordre</button>
    <div id="browse-container">
        <Card :data=repo v-for="repo in output" :key="repo.id" />
    </div>
</template>
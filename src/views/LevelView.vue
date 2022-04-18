<template>
    <div id="browse-container">
        <Card :data=card v-for="card in data" :key="card.id" />
    </div>
</template>

<script lang="ts">
import data from "./../data.json"
import Card from "../components/Card.vue"

export default {
    computed: {
        data(): Array<object> {
            return data.filter(repo => {
                // @ts-ignore
                return repo.level == parseInt(this.$route.params.id);
            });
        }
    },
    components: { Card }
}
</script>
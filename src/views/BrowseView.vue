<script setup lang="ts">
import Card from "./../components/Card.vue"
import data from "./../data.json"
</script>


<template>
    <div id="browse-container">
        <Card :data=card v-for="card in data" :key="card.id" />
    </div>
</template>
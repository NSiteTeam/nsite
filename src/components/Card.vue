<script lang="ts">
    import data from "./../data.json"

    export default {
        props: ["data"]
    }
</script>


<template>
    <div class="card">
        <img :src="data.image" alt="placeholder" class="card-image">
        <h3 class="card-title">{{ data.title }}</h3>
        <i>Niveau: {{ data.level }} • Ajouté le {{ data.publication_date }}</i>
        <p class="card-descr">{{ data.description }}</p>
    </div>
</template>
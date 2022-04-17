<script lang="ts">
    import data from "./../data.json"

    export default {
        props: ["data"],
    }
</script>


<template>
    <RouterLink :to="'/repository/' + data.id" class="card">
        <img :src="data.image" alt="placeholder" class="card-image">
        <h3 class="card-title">{{ data.title }}</h3>
        <i>Niveau: {{ data.level }} • Ajouté le 
        {{ 
            (new Date(parseInt(data.publication_date)))
            .toISOString().split('T')[0].split('-').reverse().join('/')
        }}
        </i>
        <p class="card-descr">{{ data.description }}</p>
    </RouterLink>
</template>
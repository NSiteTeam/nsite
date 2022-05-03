<script setup lang="ts">
    const props = defineProps(['exercise'])
    const repo = props.exercise //<!-- TODO: Rename-->
</script>


<template>
    <RouterLink :to="'/repository/' + repo.id" class="card">
        <img :src="repo.image" alt="placeholder" class="card-image">
        <h3 class="card-title">{{ repo.title }}</h3>
        <!--TODO: Change this -->
        <i>Niveau: {{ repo.level }}ème • Ajouté le
        {{
            (new Date(parseInt(repo.publication_date)))
            .toISOString().split('T')[0].split('-').reverse().join('/')
        }}
        </i>
        <p class="card-descr">{{ repo.description }}</p>
    </RouterLink>
</template>

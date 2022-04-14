<script lang="ts">
    import data from "./../data.json"

    export default {
        props: ["id"],
        setup() {
            output: data.filter(card => {return card.id == this.id})
        }
    }
</script>


<template>
    <div class="card">
        <img src="https://via.placeholder.com/256" alt="placeholder" class="card-image">
        <h3 class="card-title">{{ data.filter(card => {return card.id == id}) }}</h3>
        <i>Niveau: 4ème • Ajouté le 13/04/2022</i>
        <p class="card-descr">Ces exercices vous aideront à réviser pour le contrôle commun de mai. </p>
    </div>
</template>
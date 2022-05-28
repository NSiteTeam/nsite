<script setup lang="ts">
import CustomDate from '@/utils/classes/CustomDate';

const props = defineProps(['exercise'])
const repo = props.exercise //<!-- TODO: Rename-->
</script>


<template>
    <RouterLink :to="'/repository/content/' + repo.id" class="card">
        <h3 class="card-title">{{ repo.title }}</h3>
        <!--TODO: Change this -->
        <i>
            <div v-if="repo.level==2">
                Niveau: {{ repo.level }}nde • Ajouté le
                {{ CustomDate.ISOStringToCustomDate(repo.publication_date).beautify() }}
            </div>
            <div v-else>
                Niveau: {{ repo.level }}ème • Ajouté le
                {{ CustomDate.ISOStringToCustomDate(repo.publication_date).beautify() }}
            </div>
        </i>
        <p class="card-descr">{{ repo.description }}</p>
    </RouterLink>
</template>

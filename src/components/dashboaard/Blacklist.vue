<script setup lang="ts">

    import { watch, ref, toRaw, onMounted, computed, shallowRef} from "vue";
    // @ts-ignore
    import DataColumn from '@/components/dashboaard/DataColumn.vue'
    const deposits: Ref<DataSection<Repository>[]> = shallowRef([])


</script>


<template>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

    <DataColumn
        title='Options de la liste noire'
        add-button-message='Ajouter des membres à la liste'
        :list='deposits'
    />


    <div class="ensemble">
        <div class="list">
            <h1>Liste noire</h1>
            <div class="list-2">
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
                <div class="user"><p>user #fcruygbduykjrfcgbesdyrfcgbhjd<button class="quit"><span class="material-symbols-outlined">close</span></button></p></div>
            </div>
        </div>
        <div class="infos">

            <h1>utilisateur #</h1>
            <div class="date">
                <h4>- Date du bannisement</h4>
                <p>cet utilisateur a été mute le 00/00/2000</p>
            </div>
            <div class="raison">
                <h4>- Type de crime</h4>
                <p>l'utilisateur à été mute car il a acheté des produits apple</p>
            </div>
            <div class="raison">
                <h4>- Crime</h4>
                <p>l'utilisateur à été mute car il a un complexe d'inferiorité</p>
            </div>
            <div class="nom-du-policier">
                <h4>- Admin</h4>
                <p>l'utilisateur à été mute par Samsung's corporation</p>
            </div>
            <div class="end">
                <h4>- Fin du banissement</h4>
                <p>l'utilisateur sera soit mute jusqu'à la fin de l'année ou jusqu'a ce que vous le dé-mutez </p>
            </div>
        </div>
    </div>
</template>
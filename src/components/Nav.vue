<script lang="ts">
    import { useWindowSize } from 'vue-window-size';
    const { width, height } = useWindowSize()

    export default {
        data() {
            return {
                windowWidth: width
            }
        },
    }
</script>

<template>
    <header class="shadow">
        <RouterLink to="/" class="banner">
            <img src="https://via.placeholder.com/64" width="64" height="64">
            <h2 v-if="windowWidth > 1024">Les mathématiques à SJH</h2>
        </RouterLink>
        <div class="search">
            <button class="material-icons white">
                search
            </button>
            <input autocomplete="off" name="search-input" class="search-input" placeholder="Rechercher">
        </div>
        <nav>
            <RouterLink to="/browse" class="navbar-link">Parcourir</RouterLink>
            <RouterLink to="/levels" class="navbar-link">Niveaux</RouterLink>
            <RouterLink to="/login" class="navbar-link">Se connecter</RouterLink>
            <RouterLink to="/register" class="navbar-link">S'inscrire</RouterLink>
        </nav>
    </header>
</template>
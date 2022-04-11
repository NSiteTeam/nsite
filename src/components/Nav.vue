<template>
    <header class="shadow1">
        <RouterLink to="/" class="banner">
            <img src="https://via.placeholder.com/64" width="64" height="64">
            <h2 v-if="windowWidth > 1250">Les mathématiques à SJH</h2>
        </RouterLink>
        <div class="search">
            <button class="material-icons white">
                search
            </button>
            <input autocomplete="off" name="search-input" class="search-input" placeholder="Rechercher">
        </div>
        <nav>
            <RouterLink to="/browse" class="navbar-link">Parcourir</RouterLink>
            <a v-if="currentRouteName == 'home'" href="#levels" class="navbar-link">Niveaux</a>
            <RouterLink v-if="connected" to="/profile" class="navbar-link">Mon compte</RouterLink>
            <RouterLink v-if="connected" to="/logout" class="navbar-link">Déconnexion</RouterLink>
            <RouterLink v-if="!connected" to="/login" class="navbar-link">Se connecter</RouterLink>
            <RouterLink v-if="!connected" to="/register" class="navbar-link">S'inscrire</RouterLink>
        </nav>
    </header>
</template>

<script lang="ts">
    import { ref } from '@vue/reactivity';
    import { useWindowSize } from 'vue-window-size';
    import { databaseClient } from '@/database/implementation';

    const { width } = useWindowSize()

    export default {
        setup() {
            return {
                windowWidth: width,
                connected: databaseClient.isConnected
            }
        },
        computed: {
            currentRouteName() {
                return this.$route.name;
            }
        }
    }
</script>

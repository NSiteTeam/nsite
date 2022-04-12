<template>
    <header class="shadow1">
        <RouterLink to="/" class="banner">
            <img src="https://via.placeholder.com/64" width="64" height="64">
            <h2 v-if="windowWidth > 1250">Les mathématiques à SJH {{ currentRouteName }} </h2>
        </RouterLink>
        <div class="search">
            <button class="material-icons white">
                search
            </button>
            <input autocomplete="off" name="search-input" class="search-input" placeholder="Rechercher">
        </div>
        <nav>
            <RouterLink to="/browse" class="navbar-link" :class="currentRouteName == 'browse' ? 'active' : ''">Parcourir</RouterLink>
            <a v-if="currentRouteName == 'home'" href="#levels" class="navbar-link">Niveaux</a>
            <RouterLink
                v-if="connected"
                to="/profile" 
                class="navbar-link" 
                :class="currentRouteName == 'profile' ? '' : 'active'">
                Mon compte {{ currentRouteName }}
            </RouterLink>
            <RouterLink v-if="connected" to="/logout" class="navbar-link" :class="currentRouteName == 'logout' ? 'active' : ''">Déconnexion</RouterLink>
            <RouterLink v-if="!connected" to="/login" class="navbar-link" :class="currentRouteName == 'login' ? 'active' : ''">Se connecter</RouterLink>
            <RouterLink v-if="!connected" to="/register" class="navbar-link" :class="currentRouteName == 'register' ? 'active' : ''">S'inscrire</RouterLink>
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
            currentRouteName(): string {
                // @ts-ignore
                return this.$route.name
            }
        }
    }
</script>

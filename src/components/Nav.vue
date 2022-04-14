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
            <div id="navbar-links" :class="toggleMenu || windowWidth > 501 ? 'display-block' : 'display-none'">
                <RouterLink to="/browse" class="navbar-link">Parcourir</RouterLink>
                <a v-if="currentRouteName == 'home'" href="#levels" class="navbar-link">Niveaux</a>
                    <RouterLink
                        v-if="connected"
                        to="/profile" 
                        class="navbar-link" 
                        :class="currentRouteName == 'profile' ? '' : 'active'">
                        Mon compte {{ currentRouteName }}
                    </RouterLink>
                    <RouterLink v-if="connected" to="/logout" class="navbar-link">Déconnexion</RouterLink>
                    <RouterLink v-if="!connected" to="/login" class="navbar-link">Se connecter</RouterLink>
                    <RouterLink v-if="!connected" to="/register" class="navbar-link">S'inscrire</RouterLink>
                    <RouterLink to="/timeline" class="navbar-link">Un peu d'Histoire</RouterLink>

            </div>
            <span @click="toggleMenuFunction()" class="material-icons white menu-button">
                menu 
            </span>
        </nav>
    </header>
</template>

<script lang="ts">
    import { ref } from '@vue/reactivity';
    import { useWindowSize } from 'vue-window-size';
    import { databaseClient } from '@/database/implementation';

    const { width } = useWindowSize()

    export default {
        data() {
            return {
                toggleMenu: false,
                windowWidth: width,
                connected: databaseClient.isConnected,
            }
        },
        methods: {
            toggleMenuFunction: function() {
                // @ts-ignore
                this.toggleMenu = !this.toggleMenu
                // @ts-ignore
                console.log(this.toggleMenu)
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

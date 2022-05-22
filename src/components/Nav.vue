<template>
    <header class="shadow1">
        <RouterLink to="/" class="banner">
            <img src="../../src/assets/logo-white.svg" width="64" height="64" class="logo">
            <h2 v-if="windowWidth > 1440">Les mathématiques à Saint Jean Hulst</h2>
        </RouterLink>
        <nav>
            <div id="navbar-links" :class="toggleMenu || windowWidth > 800 ? 'display-block' : 'display-none'">
                <RouterLink to="/browse" class="navbar-link browse-link">Parcourir</RouterLink>
                <RouterLink
                    v-if="connected"
                    to="/profile"
                    class="navbar-link"
                    v-bind:class="{ active: isProfilePage }"
                >
                    Mon compte
                </RouterLink>
                <RouterLink to="/timeline" class="navbar-link">Un peu d'Histoire</RouterLink>
                <RouterLink v-if="connected" to="/logout" class="navbar-link">Déconnexion</RouterLink>
                <RouterLink v-if="!connected" to="/login" class="navbar-link">Se connecter</RouterLink>
                <RouterLink v-if="!connected" to="/register" class="navbar-link">S'inscrire</RouterLink>

            </div>
            <span @click="toggleMenuFunction()" class="material-icons white menu-button">
                menu
            </span>
        </nav>
    </header>
</template>

<script setup lang="ts">
    import { ref } from '@vue/reactivity';
    import { useWindowSize } from 'vue-window-size';
    import { databaseClient } from '@/database/implementation';
    import { useRoute } from 'vue-router';
    import { computed } from '@vue/runtime-core';

    const { width } = useWindowSize()
    const route = useRoute()

    const toggleMenu = ref(false)
    const windowWidth = width
    const connected = databaseClient.isConnected
    const levels = [
        'Terminale',
        'Première',
        'Seconde',
        'Troisième',
        'Quatrième',
        'Cinquième',
        'Sixième',
    ]

    function toggleMenuFunction() {
        toggleMenu.value = !toggleMenu.value
    }

    const isProfilePage = computed(
        () => { route.name == 'profile' }
    )
</script>

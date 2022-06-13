<template>
    <header class="shadow1">
        <RouterLink to="/" class="banner">
            <img src="../../src/assets/logo.svg" width="64" height="64" class="logo">
            <h2 v-if="windowWidth > 1440">Les mathématiques à Saint Jean Hulst</h2>
        </RouterLink>
        <nav>
            <div id="navbar-links" :class="toggleMenu || windowWidth > 800 ? 'display-block' : 'display-none'">
                <RouterLink to="/browse" class="navbar-link browse-link"><span>Parcourir</span></RouterLink>
                <RouterLink to="/timeline" class="navbar-link"><span>Un peu d'Histoire</span></RouterLink>
                <RouterLink v-if="!connected" to="/login" class="navbar-link"><span>Se connecter</span></RouterLink>
                <RouterLink v-if="!connected" to="/register" class="navbar-link"><span>S'inscrire</span></RouterLink>
                <RouterLink v-if="hasAccessToDashboard" to="/dashboard" class=navbar-link><span>Gestion des élèves</span></RouterLink>
                <RouterLink
                    to="/profile"
                    class="navbar-link"
                >
                    <ProfilePicture v-if="connected" size='32px' />
                </RouterLink>

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
    import ProfilePicture from '@/components/ProfilePicture.vue'

    const { width } = useWindowSize()
    const route = useRoute()

    const toggleMenu = ref(false)
    const windowWidth = width

    const connected = databaseClient.isConnected

    function toggleMenuFunction() {
        toggleMenu.value = !toggleMenu.value
    }

    const hasAccessToDashboard = computed(
        () => databaseClient.isConnected.value && databaseClient.user.value?.permissions
    )
</script>

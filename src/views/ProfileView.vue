<template>
    <div id="profile-container"  class="shadow2">
        <span class="profile-title">
            <span class="material-icons white">
                account_circle
            </span>
            Mon profil:
        </span>
        <ul class="table-part">
            <li class="white">Adresse mail: <i>{{ email }}</i></li>
            <li class="white">Nom d'utilisateur: <i>{{ username }}</i></li>
            <li class="white">Uuid : <i>{{ uuid }}</i></li>
            <li class = "white">Rôle : <i> {{ permissions }}</i></li>
        </ul>

        <RouterLink  to="/dashboard" class="navbar-link">Dashboard</RouterLink>

    </div>
</template>
<!--TODO: REWORK COMPLETLY THIS HORRIBLE THING (: -->
<script setup lang="ts">
    import { databaseClient } from '@/database/implementation';

    const email = databaseClient.user.value?.email
    const uuid = databaseClient.user.value?.uuid
    const username = databaseClient.user.value?.username
    const permissions = databaseClient.user.value?.permissions.join(', ')
</script>

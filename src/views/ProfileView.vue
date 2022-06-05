<template>
    <div id="profile-container"  class="shadow2">
        <div class="user-infos">
            <span class="profile-title">
                <span class="material-icons white">
                    account_circle
                </span>
                {{ username }}
            </span>
            <div class="user-details">
                <div class="label">Adresse mail: </div>
                <div class="value">{{ email }}</div>
                <div class="label">Nom d'utilisateur: </div>
                <div class="value">{{ username }}</div>
                <div class="label">Uuid : </div>
                <div class="value">{{ uuid }}</div>
                <div class="label">Rôles : </div>
                <ul class="value">
                    <li class="permission" v-for="(permission, index) in permissions" :key="index">
                        {{ permission }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <RouterLink  to="/dashboard" class="navbar-link">Dashboard</RouterLink>
</template>
<!--TODO: REWORK COMPLETLY THIS HORRIBLE THING (: -->
<script setup lang="ts">
    import { databaseClient } from '@/database/implementation';

    const email = databaseClient.user.value?.email
    const uuid = databaseClient.user.value?.uuid
    const username = databaseClient.user.value?.username
    const permissions = databaseClient.user.value?.permissions
</script>

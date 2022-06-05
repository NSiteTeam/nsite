<template>
    <div id="profile-container"  class="shadow2">
        <div class="user-infos">
            <span class="profile-title">
                <ProfilePicture size='48px'/>
                <span id='username'> {{ username }} </span>
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

<script setup lang="ts">
    import { databaseClient } from '@/database/implementation'
    import ProfilePicture from '@/components/ProfilePicture.vue'
    import { computed } from 'vue'

    const email = computed(() => databaseClient.user.value?.email)
    const uuid = computed(() => databaseClient.user.value?.uuid)
    const username = computed(() => databaseClient.user.value?.username)
    const permissions = computed(() => databaseClient.user.value?.permissions)
</script>

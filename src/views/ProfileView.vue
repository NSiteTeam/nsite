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
                <div class="value">
                    {{ email }}
                    <button @click="toggleEmail()">
                        {{ displayEmail ? 'Masquer' : 'Afficher' }}
                    </button>
                </div>
                <div class="label">Nom d'utilisateur: </div>
                <div class="value">{{ username }}</div>
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
    import { databaseClient } from '@/database/implementation';
    import { computed, ref } from 'vue';

    const username = databaseClient.user.value?.username
    const email = computed(
        _ => {
            if (databaseClient.user.value?.email && !displayEmail.value) {
                return (databaseClient.user.value.email
                .split('@')[0].replace(/\w/g,'*') + '@'
                + databaseClient.user.value.email
                .split('@')[1])
            } else {
                return databaseClient.user.value?.email
            }
        }
    )
    const permissions = databaseClient.user.value?.permissions
    console.log(databaseClient.user.value)
    const displayEmail = ref(false)

    function toggleEmail() {
        displayEmail.value = !displayEmail.value
    }
</script>

<template>
    <div id="profile-container"  class="shadow2">
        <span class="profile-title">
            <span class="material-icons white">
                account_circle
            </span>
            Mon profil:
        </span>
        {{ usernames }}
        <ul class="table-part">
            <li class="white">Adresse mail: <i>{{ email }}</i></li>
            <li class="white">Nom d'utilisateur: <i>{{ usernameRef ? usernameRef.username : "" }}</i></li>
            <li class="white">Dernière date de connection: <i>{{ LastConnexion }}</i></li>
            <li class="white">Création du compte: <i>{{ CreationDate }}</i></li>
            <li class="white">Uuid : <i>{{ uuid }}</i></li>
            <li class = "white">Rôle : <i> {{ roleRef.join(', ') }}</i></li>
        </ul>

        <RouterLink  to="/dashboard" class="navbar-link">Dashboard</RouterLink>

    </div>
</template>

<script setup lang="ts">
    import { databaseClient } from '@/database/implementation';
    import { ref } from '@vue/reactivity';
    import { computed } from 'vue';
    import type { Ref } from 'vue'
    import type { Username } from '@/database/interface/username'
    import type { RoleInterface } from '@/database/interface/Role'
    import CustomDate from '../utils/classes/CustomDate'
    import { SupabaseUsername } from '@/database/supabase/supabase_username';
    import type { Permission } from '@/database/interface/permissions';

    // TODO: Display all usernames in the database
    const email = databaseClient.email.value
    const uuid = databaseClient.uuid
    const LastConnexion = computed(_ => {
        if (databaseClient.last_date.value == null) return null
        return CustomDate.ISOStringToCustomDate(databaseClient.last_date.value).beautify()
    })
    const CreationDate = computed(_ => {
        if (databaseClient.accountCreationDate.value == null) return null
        return CustomDate.ISOStringToCustomDate(databaseClient.accountCreationDate.value).beautify()
    })
    const usernameRef: Ref<Username | null> = ref(null)
    const roleRef: Ref<Permission[] | null> = ref(null)

    if (uuid.value != null) {
        databaseClient.getUsername(uuid.value).then((username: Username) => {
            usernameRef.value = username
        if (uuid.value != null) {
            roleRef.value = databaseClient.permissions.value
        }
        }).catch(error => {
            throw error
        })
    }

    
</script>

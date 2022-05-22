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
            <li class="white">Adresse mail: <i>{{ mail }}</i></li>
            <li class="white">Nom d'utilisateur: <i>{{ MyUsername }}</i></li>
            <li class="white">Dernière date de connection: <i>{{ date }}</i></li>
            <li class="white">ID : <i>{{ uuid }}</i></li>
        </ul>

        
        <RouterLink  to="/dashboard" class="navbar-link">Dashboard</RouterLink>

    </div>
</template>

<script setup lang="ts">
    import { databaseClient } from '@/database/implementation';
    import { ref } from '@vue/reactivity';
    import type { Ref } from 'vue';
    import type { Username } from '@/database/interface/username'
    import type CustomDate from '../utils/classes/CustomDate'
    import { SupabaseUsername } from '@/database/supabase/supabase_username';

    // TODO: Display all usernames in the database
    const email = databaseClient.email.value
    const uuid = databaseClient.uuid
    // const ID = databaseClient.
    const usernameRef: Ref<Array<Username>> = ref([])
    const MyUsername: Ref<string> = ref("")
    
    const usernamesAttribute = databaseClient.getUsernames().then((usernames: Username[]) => {
        usernameRef.value = (usernames.filter((supabaseUsername) => {
            console.log(supabaseUsername.username)
            if (supabaseUsername.user == databaseClient.uuid.value){
                MyUsername.value = supabaseUsername.username
            }

        }))
    }).catch(error => {
        throw error
    })
    
</script>

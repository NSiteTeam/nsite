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
            <li class="white">Adresse mail: <i>{{ val_email }}</i></li>
            <li class="white">Nom d'utilisateur: <i>{{ usernameRef }}</i></li>
            <li class="white">Dernière date de connection: <i>{{ date }}</i></li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { databaseClient } from '@/database/implementation';
    import { ref } from '@vue/reactivity';
    import type { Ref } from 'vue';
    import type { Username } from '@/database/interface/username'
    import type CustomDate from '../utils/classes/CustomDate'

    // TODO: Display all usernames in the database
    const email = databaseClient.email
    const val_email = email.value
    const usernameRef: Ref<Array<any>> = ref([])

    const usernames = databaseClient.getUsernames().then(usernames => {
        usernameRef.value = (usernames.filter((supabaseUsername: Username) => {
            return supabaseUsername.id = databaseClient.uuid
        }))
    }).catch(error => {
        throw error
    })

    console.log(usernames)
</script>

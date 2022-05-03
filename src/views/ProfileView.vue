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
            <li class="white">Nom d'utilisateur: </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { databaseClient } from '@/database/implementation';
    import { ref } from '@vue/reactivity';
    import type { Ref } from 'vue';
    import type { Username } from '@/database/interface/username'

    // TODO: Display all usernames in the database
    const email = databaseClient.email
    const usernames: Ref<Array<Username>> = ref([])

    databaseClient.getUsernames(res => {
        usernames.value = res
    })
</script>

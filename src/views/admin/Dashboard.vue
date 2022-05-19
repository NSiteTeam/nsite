<template>
    <div id="profile-container"  class="shadow2">
        salut les tchoupis fans

    </div>
</template>

<script setup lang="ts">
    import { databaseClient } from '@/database/implementation';
    import { ref } from '@vue/reactivity';
    import type { Ref } from 'vue';
    import type { Username } from '@/database/interface/username';
    databaseClient

    console.log(databaseClient)

    // TODO: Display all usernames in the database
    const email = databaseClient.email
    const val_email = email.value

    const usernames: Ref<Array<Username>> = ref([])

    databaseClient.getUsername()
</script>

<template>
    <div v-if="isAdmin">
        <p>
            Wow, you're an Admin !
        </p>
    </div>
    <div v-else>
        <p>
            It's sad, but you't can't see this page...
        </p>
    </div>
</template>

<script setup lang="ts">
    import { databaseClient } from '@/database/implementation';
    import { Permission } from '@/database/interface/permissions';
    import { computed } from 'vue';

    const isAdmin = computed(
        () => Permission.GLOBAL_ADMIN in databaseClient.permissions.value
    )
</script>

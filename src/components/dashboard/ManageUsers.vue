<script setup lang="ts">
    // @ts-ignore
    import DataColumn from '@/components/dashboard/DataColumn.vue'
    import { databaseClient } from "@/database/implementation"
    import type { User } from '@/database/interface/user'
    import type { Ref } from 'vue'
    import { ref, computed } from 'vue'

    const users: Ref<User[]> = ref([])
    const selectedUser: Ref<User | undefined> = ref()

    await databaseClient.getAllUsers()
    .then(res => {
        users.value = res
    }).catch(err => {
        console.warn(err)
    })
</script>


<template>
    <div class="manage-users">
        <div class="manage-users-header">
            <div class="manage-users-header-title">Nom d'utilisateur</div>
            <div class="manage-users-header-title">Identifiant unique</div>
            <div class="manage-users-header-title">Rôle le plus haut</div>
        </div>
        <div class="manage-users-row">
            <div class="manage-users-cell">
                <div class="manage-users-row-username" v-for="(user, index) in users" :key="index">
                    {{ user.username }}
                </div>
            </div>
            <div class="manage-users-cell">
                <div class="manage-users-row-uuid" v-for="(user, index) in users" :key="index">
                    {{ user.user }}
                </div>
            </div>
            <div class="manage-users-cell">
                <div class="manage-users-row-uuid" v-for="(user, index) in users" :key="index">
                    {{ Math.max(user.roles.map(role => Number(role))) }}
                </div>
            </div>
        </div>
    </div>
</template>
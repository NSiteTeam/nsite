<script setup lang="ts">
    // @ts-ignore
    import { SupabasePermissionHelper } from '@/database/supabase/supabase_permission_helper'
    import DataColumn from '@/components/dashboard/DataColumn.vue'
    import { Permission } from "@/database/interface/permissions"
    import { databaseClient } from "@/database/implementation"
    import type { User } from '@/database/interface/user'
    import type { Ref } from 'vue'
    import { ref } from 'vue'

    const users: Ref<any[]> = ref([])
    const selectedUser: Ref<User | undefined> = ref()

    await databaseClient.getAllUsers()
    .then(res => {
        users.value = res
    }).catch(err => {
        console.warn(err)
    })

    function getPermissionFromId(permissionId: number) {
        return SupabasePermissionHelper.permissionFromId(permissionId)
    }
</script>


<template>
    <div class="manage-users">
        <div class="manage-users-table">
            <div class="header">
                <div class="cell">Nom d'utilisateur</div>
                <div class="cell">Identifiant unique</div>
                <div class="cell">Rôle le plus haut</div>
            </div>
            <div class="row" v-for="(user, index) in users" :key="index">
                <div class="cell">
                    {{ user.username }}
                </div>
                <div class="cell">
                    {{ user.user }}
                </div>
                <div class="cell">
                    {{ getPermissionFromId(Math.max(... user.roles.map(role => Number(role)))) }}
                </div>
            </div>
            <div class="footer">
                <div class="cell"></div>
                <div class="cell">Afficher plus</div>
                <div class="cell"></div>
            </div>
        </div>
    </div>
</template>
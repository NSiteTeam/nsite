<template>
    <div id="profile-container"  class="shadow2">
        <div class="user-infos">
            <span class="profile-title">
                <ProfilePicture size='48px'/>
                <span id='username'> {{ username }} </span>
                <RouterLink id='disconnect-icon' to="/logout"><span class='material-icons'>logout</span></RouterLink>
            </span>
            <div class="user-details">
                <div class="label">Adresse mail</div>
                <div class="value">
                    {{ email }}
                    <span @click="toggleEmail">
                        {{ displayEmail ? 'Masquer' : 'Afficher' }}
                    </span>
                </div>
                <div class="label">Nom d'utilisateur</div>
                <div class="value">{{ username }}</div>
                <div class="label">Permissions</div>
                <ul class="value" v-if="permissions">
                    <li class="permission" v-for="(permission, index) in permissions" :key="index">
                        {{ permission }}
                    </li>
                </ul>
                <i class="value" v-else>Élève lambda</i>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { databaseClient } from '@/database/implementation'
    import ProfilePicture from '@/components/ProfilePicture.vue'
    import LoadingAnimation from '@/components/LoadingAnimation.vue'
    import { computed, ref } from 'vue'

    const uuid = computed(() => databaseClient.user.value?.uuid)
    const username = computed(() => databaseClient.user.value?.username)
    const permissions = computed(() => {
        return databaseClient.user.value ? databaseClient.user.value.permissions : null
    })

    const email = computed(
        () => {
            const email = databaseClient.user.value?.email

            if (email && !displayEmail.value) {
                const splitted = email.split('@')
                return splitted[0].replace(/\w/g,'*') + '@' + splitted[1]
            } else {
                return email
            }
        }
    )

    const displayEmail = ref(false)

    function toggleEmail() {
        displayEmail.value = !displayEmail.value
    }
</script>

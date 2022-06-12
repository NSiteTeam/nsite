<template>
    <div
        id="profile-picture-container"
        :style='{
            backgroundColor: backgroundColor,
            width: size,
            height: size,
            fontSize: size * 0.8
        }'
    >
        <span v-if="noUsername" class="material-icons white" :style='{ fontSize: size }'>
            account_circle
        </span>

        <span v-else-if="oneLetterName">
            {{ oneLetterName }}
        </span>

        <span v-else>
            {{ twoLetterName }}
        </span>
    </div>
</template>

<script setup lang="ts">
    import { databaseClient } from "@/database/implementation";
    import { computed, watch } from "vue";

    console.log(databaseClient.user.value)
    const props = defineProps(['size'])
    const size = props.size

    const noUsername = computed(
        () => !databaseClient.user.value?.username
    )

    const oneLetterName = computed(
        () => {
            const words = databaseClient.user.value?.username.split(' ')
            if (words?.length == 1) {
                return words[0].charAt(0).toUpperCase()
            } else {
                return null
            }
        }
    )

    const twoLetterName = computed(
        () => {
            const words = databaseClient.user.value?.username.split(' ')
            if (words && words.length >= 2) {
                return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase()
            } else {
                return null
            }
        }
    )

    const backgroundColor = computed(
        () => {
            const username = databaseClient.user.value?.username
            if (username) {
                return '#' + mulberry32(hashCode(username))
            } else {
                return '#0000'
            }
        }
    )

    // We use some cryptographic functions took on stack overflow to generate random colors based on username

    // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
    function mulberry32(seed: number) {
        // WTF
        var t = seed += 0x6D2B79F5;
        // Evil bit hack
        t = Math.imul(t ^ t >>> 15, t | 1);
        // Same
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        // WTF too
        return Math.floor((((t ^ t >>> 14) >>> 0) / 4294967296)*16777215).toString(16)
    }

    // https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
    function hashCode(str: string) {
        let hash = 0;
        for (let i = 0, len = str.length; i < len; i++) {
            let chr = str.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

</script>

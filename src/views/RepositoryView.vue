<script setup lang="ts">
import type { Repository } from "@/database/interface/repositories"
import { databaseClient } from "@/database/implementation"
import { useRoute } from "vue-router"
import { ref, computed, onMounted } from 'vue'
import type { Ref } from "vue"
import type CustomFile from "@/database/interface/file";
import SupabaseMessage from "@/database/supabase/supabase_message";
import CustomDate from '@/utils/classes/CustomDate'
// @ts-ignore : oui je sais c'est pas bien, mais c'est un bug de vue
import Chat from "../components/Chat.vue";
// @ts-ignore : oui je sais c'est pas bien, mais c'est un bug de vue
import Files from '../components/Files.vue';

const id = Number(useRoute().params.id[0])
const files: Ref<CustomFile[]> = databaseClient.files
const repoData: Ref<Repository[]> = databaseClient.repositories
databaseClient.clearFiles()
await databaseClient.getRepos(id)
console.log("Got data :", repoData.value)
</script>

<template>
    <!-- ensemble -->
    <div id="repo">
        <h3 id="repo-title">
            {{ repoData[0].title }}
            <i>
                Niveau : {{ repoData[0].level }}ème, 
                {{ CustomDate.ISOStringToCustomDate(repoData[0].publication_date).beautify(false) }}
            </i>
        </h3>
        <ul id="repo-menu">
            <RouterLink id="content" :to="'/repository/content/' + useRoute().params.id"
            :class="useRoute().params.content == 'content' ? 'active' : ''" >
                <span class="icon material-icons">
                    cloud
                </span>
                Contenu
            </RouterLink>
            <RouterLink id="chat" :to="'/repository/chat/' + useRoute().params.id"
            :class="useRoute().params.content == 'chat' ? 'active' : ''">
                <span class="icon material-icons">
                    chat
                </span>
                Discussion
            </RouterLink>
        </ul>
        <div id="repo-body" v-if="useRoute().params.content == 'content'">
            <Files :fileIds="repoData[0].content" />
            <div class="repo-descr">
                <h4>Description</h4>
                {{ repoData[0].description }}
            </div>
        </div>
        <!-- CHAT -->
        <Chat id="repo-chat" :depoId="repoData[0].id" v-if="useRoute().params.content == 'chat'" />
    </div>
</template>
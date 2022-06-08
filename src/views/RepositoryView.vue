<script setup lang="ts">
    import type { Repository } from "@/database/interface/repositories"
    import { databaseClient } from "@/database/implementation"
    import { useRoute } from "vue-router"
    import { ref, computed, onMounted } from 'vue'
    import type { Ref } from "vue"
    import type CustomFile from "@/database/interface/file";
    import SupabaseMessage from "@/database/supabase/supabase_message";
    import { LongDate }from '@/utils/long_date'
    import Chat from "../components/Chat.vue";
    import Files from '../components/Files.vue';

    const id = Number(useRoute().params.id[0])
    const files: Ref<CustomFile[]> = databaseClient.files
    const repoData: Ref<Repository | null> = ref(null)
    databaseClient.getDeposit(id).then(res => repoData.value = res)
</script>

<template>
    <!-- ensemble -->
    <div id="repo">
        <h3 id="repo-title">
            {{ repoData.title }}
            <i>
                <div>
                    Niveau : {{ repoData.level.fullName }},
                    {{ LongDate.ISOStringToLongDate(repoData.publication_date).beautify(false) }}
                </div>
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
            <Files :fileIds="repoData.content" />
            <div class="repo-descr">
                <h4>Description</h4>
                {{ repoData.description }}
            </div>
        </div>
        <!-- CHAT -->
        <Chat id="repo-chat" :depoId="repoData.id" v-if="useRoute().params.content == 'chat'" />
    </div>
</template>
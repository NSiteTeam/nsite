<script setup lang="ts">
import type { Repository } from "@/database/interface/repositories"
import { databaseClient } from "@/database/implementation"
import { useRoute } from "vue-router"
import type { Ref } from 'vue'
import type File from "@/database/interface/file";

const id = Number(useRoute().params.id[0])
const files: Ref<File[]> = databaseClient.files
const repoData: Ref<Repository[]> = databaseClient.repositories
databaseClient.getRepos(id).then(repos => {
    repoData.value[0].content.map((fileID: string | number) => {
        databaseClient.getFile(Number(fileID))
    })
})


const activeTab: String = "content"
</script>

<script lang="ts">
// import { defineComponent, ref } from 'vue'
// import { toRaw } from 'vue';
// import type { Ref } from 'vue'
// import { useRoute } from "vue-router"

// const activeTab: String = "chat"

// function formatDate(timestamp: number) {
//     const date = new Date(timestamp)
    
//     return date.toISOString().split('T')[0].split('-').reverse().join('/')
// }

// function getDataFromId(id: string | number): Repository {
//     id = Number(id)
//     const repos: Ref<Repository[]> = databaseClient.repositories
//     databaseClient.getRepos(id)
//     // console.log(toRaw(repos.value))
//     return toRaw(repos.value)[0]
// }

// export default defineComponent({
//     setup() {
//         const id = Number(useRoute().params.id[0])
//         const repos: Ref<Repository[]> = databaseClient.repositories
//         databaseClient.getRepos(id)
//         console.log(toRaw(repos.value))
//     },
//     data(): object {
//         return {
//             repoData: getDataFromId(this.$route.params.id[0]),
//             dates: getDataFromId(this.$route.params.id[0]).content.map(repo => {
//                 return formatDate(repo.date)
//             }),
//             activeTab: activeTab,
//             items:[],
            
//             Chat: ''
            
//         }
//     },
//     methods: {
//         setActiveTab(tabId: String): void {
//             this.activeTab = tabId
//         },
//         formatDate,
//         addMessage: function() {
//             this.items.push({message:this.Chat});
//             this.Chat = '';
//         }

//     },
//     computed: {
//         date(): string {
//             const timestamp = getDataFromId(this.$route.params.id[0]).publication_date
//             return  formatDate(parseInt(timestamp))
//         }
//     }
// })
</script>

<template>
    {{ files }}
    <!-- ensemble -->
    <div id="repo">
        <h3 id="repo-title">{{ repoData[0].title }} <i>Niveau : {{ repoData.level }}ème</i></h3>
        <ul id="repo-menu">
            <li id="content" :class="activeTab == 'content' ? 'active' : ''" @click="setActiveTab('content')">
                <span class="icon material-icons">
                    cloud
                </span>
                Contenu
            </li>
            <li id="chat" :class="activeTab == 'chat' ? 'active' : ''" @click="setActiveTab('chat')">
                <span class="icon material-icons">
                    chat
                </span>
                Discussion
            </li>
        </ul>
        <div id="repo-body">
            <div id="repo-content" v-if="activeTab == 'content'">
                <div class="repo-content-row" v-for="(data, index) in repoData.content" :key="data.id">
                    <span class="file-title">
                        <span class="material-icons">
                            {{ data.icon }}
                        </span>
                        <div class="file-title-name">
                            {{ data.name }}
                        </div>
                    </span>
                    <div class="file-last-commit">
                        <span class="file-last-commit-author">
                            {{ data.last_commit.author }}
                        </span> :
                        {{ data.last_commit.text }}
                    </div>
                    <span class="date">{{ dates[index] }}</span>
                </div>
            </div>
            <div v-if="activeTab == 'content'" class="repo-descr">
                <h4>Description</h4>
                {{ repoData.description }}
            </div>
        </div>
        <!-- CHAT -->
        <div id="repo-chat" v-if="activeTab == 'chat'">
            
            <div class="conversation">
                
                    <div class="message" i v-for="item in items" :key="item.message" align="right">
                        <p>{{item.message}}</p>                  
                    </div>
                

            </div>
            
            <input type="text" placeholder="Votre message" v-model="Chat" v-on:keyup.enter="addMessage">
        </div>
    </div>
</template>
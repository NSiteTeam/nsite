<script setup lang="ts">
import type { Repository } from "@/database/interface/repositories"
import { databaseClient } from "@/database/implementation"
import { useRoute } from "vue-router"
import type { Ref } from 'vue'
import type File from "@/database/interface/file";
import CustomDate from "@/utils/classes/CustomDate";
import type date from "@/utils/interface/date";

const id = Number(useRoute().params.id[0])
const files: Ref<File[]> = databaseClient.files
const repoData: Ref<Repository[]> = databaseClient.repositories
databaseClient.getRepos(id).then(repos => {
    repoData.value[0].content.map((fileID: string | number) => {
        databaseClient.getFile(Number(fileID))
    })
})

const activeTab: String = "content"

function formatDate(rawDate: string) {
    const customDate: date = new CustomDate(
        Number(rawDate.split('T')[1].split(':')[2].split('.')[0]), 
        Number(rawDate.split('T')[1].split(':')[1]),
        Number(rawDate.split('T')[1].split(':')[0]),
        Number(rawDate.split('T')[0].split('-')[2]),
        Number(rawDate.split('T')[0].split('-')[1]),
        Number(rawDate.split('T')[0].split('-')[0]),
    )
    return customDate
}
</script>

<template>
    <!-- ensemble -->
    <div id="repo">
        <h3 id="repo-title">{{ repoData[0].title }} <i>Niveau : {{ repoData[0].level }}ème ; Date : {{ formatDate(repoData[0].publication_date).beautify() }}</i></h3>
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
                <div class="repo-content-row" v-for="data in files" :key="data.id">
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
                            {{ data.last_commit_author }}
                        </span> :
                        {{ data.last_commit_text }}
                    </div>
                    <span class="date">{{ formatDate(data.date).beautify() }}</span>
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
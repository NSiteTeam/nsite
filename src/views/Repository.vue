<script lang="ts">
import data from "./../data.json"
import { defineComponent } from 'vue'

const activeTab: String = "chat"

function formatDate(timestamp: number) {
    const date = new Date(timestamp)
    // @ts-ignore
    return date.toISOString().split('T')[0].split('-').reverse().join('/')
}

function getDataFromId(id: string, data: Array<object>): object {
    return data.filter(repo => {
        // @ts-ignore
        return repo.id == parseInt(id)
    })[0]
}

export default defineComponent({
    data(): object {
        return {
            // @ts-ignore
            repoData: getDataFromId(this.$route.params.id, data),
            // @ts-ignore
            dates: getDataFromId(this.$route.params.id, data).content.map(repo => {
                return formatDate(repo.date)
            }),
            activeTab: activeTab,
            items:[],
            
            Chat: ''
            
        }
    },
    methods: {
        setActiveTab(tabId: String): void {
            // @ts-ignore
            this.activeTab = tabId
        },
        formatDate,

        addMessage: function() {
            // @ts-ignore
            this.items.push({message:this.Chat});
            // @ts-ignore
            this.Chat = '';
            
        }

    },
    computed: {
        date(): string {
            // @ts-ignore
            const timestamp = getDataFromId(this.$route.params.id, data).publication_date
            return  formatDate(parseInt(timestamp))
        },
        last_commit(): string {
            // @ts-ignore
            const repoContent = getDataFromId(this.$route.params.id, data).content
            // @ts-ignore
            const dates: Array<number> =repoContent.map(repo => {
                return repo.date
            })
            // @ts-ignore
            const ids: Array<number> = repoContent.map(repo => {
                return repo.id
            })
            const lastestDate = Math.max(... dates)
            // @ts-ignore
            const lastestCommit: number = repoContent.filter(file => {
                if (file.date == lastestDate) {
                    return file.last_commit
                }
            })[0]
            // @ts-ignore
            return lastestCommit
        }
    }
})
</script>

<template>
    <!-- ensemble -->
    <div id="repo">
        <h3 id="repo-title">{{ repoData.title }} <i>Ajouté le : {{ formatDate(last_commit.date) }} • Niveau : {{ repoData.level }}ème</i></h3>
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
                <div class="header">
                    {{ last_commit.last_commit.author }} : 
                    {{ last_commit.last_commit.text }}
                </div>
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
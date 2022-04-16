<script lang="ts">
import data from "./../data.json"
import { defineComponent } from 'vue'

const activeTab: String = "content"

export default defineComponent({
    data(): object {
        return {
            repoData: data.filter(repo => {
                // @ts-ignore
                return repo.id == parseInt(this.$route.params.id)
            })[0],
            activeTab: activeTab
        }
    },
    methods: {
        setActiveTab(tabId: String): void {
            // @ts-ignore
            this.activeTab = tabId
        }
    },
    computed: {
        date(): string {
            const timestamp = data.filter(repo => {
                // @ts-ignore
                return repo.id == parseInt(this.$route.params.id)
            })[0].publication_date
            return  (new Date(parseInt(timestamp))).getDate() + '/' +
                    (new Date(parseInt(timestamp))).getMonth() + '/' +
                    (new Date(parseInt(timestamp))).getFullYear()
        }
    }
})
</script>

<template>
    <div id="repo">
        <h3 id="repo-title">{{ repoData.title }} <i>{{ date }}</i></h3>
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
        <div id="repo-content" v-if="activeTab == 'content'">
            <div class="header">
                M. Kenesson: j'ai ajouté des exercices.
            </div>
            <div class="repo-content-row">
                <span class="file-title">
                    <span class="material-icons">
                        picture_as_pdf
                    </span>
                    <div class="file-title-name">
                        Exercice 1
                    </div>
                </span>
                <span class="date">31/12/2021</span>
            </div>
            <div class="repo-content-row">
                <span class="file-title">
                    <span class="material-icons">
                        picture_as_pdf
                    </span>
                    <div class="file-title-name">
                        Exercice 2
                    </div>
                </span>
                <span class="date">31/12/2021</span>
            </div>
            <div class="repo-content-row">
                <span class="file-title">
                    <span class="material-icons">
                        picture_as_pdf
                    </span>
                    <div class="file-title-name">
                        Exercice 3
                    </div>
                </span>
                <span class="date">31/12/2021</span>
            </div>
            <div class="repo-content-row">
                <span class="file-title">
                    <span class="material-icons">
                        picture_as_pdf
                    </span>
                    <div class="file-title-name">
                        Exercice 4
                    </div>
                </span>
                <span class="date">31/12/2021</span>
            </div>
            <div class="repo-content-row">
                <span class="file-title">
                    <span class="material-icons">
                        picture_as_pdf
                    </span>
                    <div class="file-title-name">
                        Exercice 5
                    </div>
                </span>
                <span class="date">31/12/2021</span>
            </div>
            <div class="repo-content-row">
                <span class="file-title">
                    <span class="material-icons">
                        picture_as_pdf
                    </span>
                    <div class="file-title-name">
                        Exercice 6
                    </div>
                </span>
                <span class="date">31/12/2021</span>
            </div>
            <div class="repo-content-row">
                <span class="file-title">
                    <span class="material-icons">
                        picture_as_pdf
                    </span>
                    <div class="file-title-name">
                        Exercice 7
                    </div>
                </span>
                <span class="date">31/12/2021</span>
            </div>
        </div>
        <div id="repo-chat" v-if="activeTab == 'chat'">
        </div>
    </div>
</template>
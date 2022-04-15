<script lang="ts">
import data from "./../data.json"

const activeTab: String = "content"

export default {
    data(): object {
        return {
            repoData: data.filter(repo => {
                // @ts-ignore
                return repo.id == parseInt(this.$route.params.id)
            })[0]
        }
    },
    methods: {
        setActiveTab(tabId: String) {

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
}
</script>

<template>
    <div id="repo-container">
        <h3 id="repo-title">{{ repoData.title }} <i>{{ date }}</i></h3>
        <ul id="repo-menu">
            <li id="content" class="active">
                <span class="icon material-icons">
                    cloud
                </span>
                Contenu
            </li>
            <li>
                <span id="chat" class="icon material-icons">
                    chat
                </span>
                Discussion
            </li>
        </ul>
    </div>
</template>
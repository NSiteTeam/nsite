<script lang="ts">
import data from "./../data.json"

export default {
    // @ts-ignore
    data() {
        return {
            repoData: data.filter(repo => {
                // @ts-ignore
                return repo.id == parseInt(this.$route.params.id)
            })[0]
        }
    },
    date(): string {
        // @ts-ignore
        return (new Date(parseInt(data.publication_date))).getDate() + '/' +
            (new Date(parseInt(data.publication_date))).getMonth() + '/' +
            (new Date(parseInt(data.publication_date))).getFullYear()
    }
}
</script>

<template>
    {{ repoData }}
    <div id="repo-container">
        
    </div>
</template>
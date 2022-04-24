<template>
    <table>
        <thead>
            <tr>
                <th>
                    <span>Actualités</span>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(news, index) in news" :key="index">
                <td style="background-color: red">
                    <div class="news-item">
                        <p>{{ news.title }}</p>
                        <p>{{ news.subtitle }}</p>
                        <p>{{ news.date }}</p>
                        <ul>
                            <li v-for="(concerned, index) in news.concerned" :key="index">
                                <p>{{ concerned }}</p>
                            </li>
                        </ul>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <button v-if="!maxNewsReached" v-on:click='fetchMore'>
                        Charger plus
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
    import { databaseClient } from "@/database/implementation";

    const BATCH_SIZE = 10

    const news = databaseClient.fetchedNews
    const maxNewsReached = databaseClient.maxNewsReached

    function fetchMore() {
        databaseClient.fetchNews(BATCH_SIZE)
    }

    fetchMore()
</script>
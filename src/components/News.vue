<template class="news-template">
  <!-- div de la page nouvelles -->
  <div class="news shadow2">
    <h1>Actualités</h1>
    <div class="liste-actualites">
      <ul>
        <li v-for="(news, index) in news" :key="index">
          <div class="news-item">
            <p>{{ news.title }} <i>{{ formatDate(news.date) }}</i></p>
            <p>{{ news.subtitle }}</p>
            <ul>
              <!-- <li v-for="(concerned, index) in news.concerned" :key="index">
                <p>{{ concerned }}</p>
              </li> -->
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
    import { databaseClient } from "@/database/implementation";
    import type { News } from "@/database/interface/news";
    import type { Ref } from "vue";
    import { ref } from "vue";

    const news: Ref<Array<News>> = ref([])

    databaseClient.fetchNews(10).then(() => {
      news.value = databaseClient.fetchedNews;
    });

    function formatDate(ISOtimestamp: String): String {
      return ISOtimestamp.split("T")[0].split("-").reverse().join("/")
    }
</script>
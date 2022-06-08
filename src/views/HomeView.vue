<template>
  <div id="home-container">
        <div class="catch-line shadow2">
          <h1>Les professeurs de mathématiques de Saint Jean Hulst ont enfin un site internet pour vous aider !</h1>
          <ul>
            <li><i class="em em-lower_left_ballpoint_pen"></i> Les annales des précédents DS avec les corrigés</li>
            <li><i class="em em-page_with_curl"></i> Des fiches d'exercices pour s'entraîner</li>
            <li><i class="em em-sports_medal"></i> Les concours de mathématiques organisés par Saint Jean Hulst</li>
            <li><i class="em em-nerd_face"></i> De quoi se préparer pour la rentrée</li>
          </ul>
        </div>

        <div class="news shadow2">
          <h1>Actualités</h1>
          <div class="news-container">
            <div v-if='!sortedNews.length' class='loading-container'>
              <LoadingAnimation size='75%'/>
            </div>
            <ul id='news-list'>
              <li v-for="(news, index) in sortedNews" :key="index">
                <div class="news-item">
                  <h3 class="news-header"> {{ news.title }} <span class='news-date'> {{ news.date.beautify() }} </span> </h3>
                  <p class='news-content'>
                    {{ news.content.slice(0, NUMBER_OF_CHAR_PER_NEWS) }}{{ news.content.length > NUMBER_OF_CHAR_PER_NEWS ? "..." : ""}}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
  import { timestampToFrenchDate } from "../utils/date"
  import { databaseClient } from "@/database/implementation"
  import type { News } from "@/database/interface/news"
  import { computed } from "vue"
  import type { Ref } from "vue"
  import { LongDate } from "@/utils/long_date"
  import Footer from "@/components/Footer.vue";
  import LoadingAnimation from "@/components/LoadingAnimation.vue";

  const NUMBER_OF_FETCHED_NEWS = 5
  const NUMBER_OF_CHAR_PER_NEWS = 100

  databaseClient.fetchNews(NUMBER_OF_FETCHED_NEWS)

  const sortedNews = computed(
    () => databaseClient.fetchedNews.value
      .filter((news: News) => news.visible)
      .sort((a: News, b: News) => -1 * LongDate.compare(
        a.date, b.date
      )
    )
  )

  function formatDate(date: string): string {
    return timestampToFrenchDate(date)
  }
</script>

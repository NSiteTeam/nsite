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
          <div class="liste-actualites">
            <ul>
              <li v-for="(news, index) in sortedNews" :key="index">
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
  </div>

  <div class="wave2"></div>

</template>

<script setup lang="ts">
import { timestampToFrenchDate } from "../utils/date"
import { databaseClient } from "@/database/implementation"
import type { News } from "@/database/interface/news"
import { computed } from "vue"
import type { Ref } from "vue"
import CustomDate from "@/utils/classes/CustomDate"

const NUMBER_OF_FETCHED_NEWS = 20

const news: Ref<Array<News>> = databaseClient.fetchedNews
databaseClient.fetchNews(NUMBER_OF_FETCHED_NEWS)

const sortedNews = computed(
  () => {
    return news.value.sort((a: News, b: News) => {
      return CustomDate.subDates(
        CustomDate.ISOStringToCustomDate(a.date),
        CustomDate.ISOStringToCustomDate(b.date),
      )
    })
  }
)

function formatDate(date: string): string {
    return timestampToFrenchDate(date)
}
</script>
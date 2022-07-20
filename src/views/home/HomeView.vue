<template>
  <div
    class="
      grid lg:grid-rows-1 lg:grid-cols-3
      p-5
    "
  >
    <ShadowBox class="lg:col-span-2 bg-white/10">
      <LargeTitle>
        Un site dédié <KeywordTitle>
        aux mathématiques</KeywordTitle>
      </LargeTitle>

      <Catchphrase smiley='🖋️'>
        Les annales des précédents DS avec <KeywordText>
        les corrigés</KeywordText>
      </Catchphrase>
      <Catchphrase smiley='📃'>
        Des <KeywordText>fiches d'exercices</KeywordText> pour
        s'entraîner
      </Catchphrase>
      <Catchphrase smiley='🏅'>
        Les concours <KeywordText> de mathématiques
        </KeywordText> organisés par Saint Jean Hulst
      </Catchphrase>
      <Catchphrase smiley='🤓'>
        De quoi <KeywordText>se préparer</KeywordText> pour
        la rentrée
      </Catchphrase>

    </ShadowBox>

    <ShadowBox class="bg-white/10">
      <LargeTitle>Les <KeywordTitle>actualités</KeywordTitle> de Saint Jean</LargeTitle>
      <div class="news-container max-h-[60vh] no-scrollbar overflow-y-scroll">
        <CenteredLoadingAnimation v-if='!newsFetched' animation-size='75%'/>

        <ul v-else>
          <li v-for="(news, index) in sortedNews" :key="index">

            <div class="mt-3">
              <SmallTitle class="news-header">
                {{ news.title }}
                <span class="text-xs italic"> {{ news.date.beautify() }} </span>
              </SmallTitle>
              <p class="mt-1 pl-3 text-justify">
                {{ formatMessage(news.content) }}
              </p>
            </div>

          </li>
        </ul>
      </div>
    </ShadowBox>
  </div>
  <Footer />
</template>

<script setup lang="tsx">
  import { timestampToFrenchDate } from '../../utils/date'
  import { databaseClient } from '@/database/implementation'
  import type { News } from '@/database/interface/news'
  import { computed, ref } from 'vue'
  import type { Ref } from 'vue'
  import { LongDate } from '@/utils/long_date'
  import Catchphrase from './Catchphrase.vue'
  import KeywordText from './KeywordText.vue'
  import KeywordTitle from './KeywordTitle.vue'
  import Footer from '@/components/Footer.vue'
  import CenteredLoadingAnimation from '@/components/style/CenteredLoadingAnimation.vue'
  import ShadowBox from '@/components/style/ShadowBox.vue'
  import LargeTitle from '@/components/style/LargeTitle.vue'
  import SmallTitle from '@/components/style/SmallTitle.vue'

  const NUMBER_OF_FETCHED_NEWS = 5
  const NUMBER_OF_CHAR_PER_NEWS = 137

  const newsFetched = ref<boolean>(false)

  const sortedNews = computed(() =>
    databaseClient.fetchedNews.value
      .filter((news: News) => news.visible)
      .sort((a: News, b: News) => -1 * LongDate.compare(a.date, b.date)),
  )

  databaseClient.fetchNews(NUMBER_OF_FETCHED_NEWS).then(_ => {
    newsFetched.value = true
  })

  function formatMessage(message: string) {
    return message.slice(0, NUMBER_OF_CHAR_PER_NEWS) + (message.length > NUMBER_OF_CHAR_PER_NEWS ? '...' : '')
  }
</script>

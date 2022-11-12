<template>
  <div class="grid p-5 lg:grid-cols-3 lg:grid-rows-1">
    <ShadowBox class="h-min bg-white/10 lg:col-span-2">
      <LargeTitle>
        Un site dédié <Keyword big secondary> aux mathématiques</Keyword>
      </LargeTitle>

      <Catchphrase smiley="🖋️">
        Les annales des précédents DS avec
        <Keyword :big="false" primary bold> les corrigés</Keyword>
      </Catchphrase>
      <Catchphrase smiley="📃">
        Des <Keyword :big="false" primary bold>fiches d'exercices</Keyword> pour s'entraîner
      </Catchphrase>
      <Catchphrase smiley="🏅">
        Les concours
        <Keyword :big="false" primary bold> de mathématiques </Keyword> organisés par Saint
        Jean Hulst
      </Catchphrase>
      <Catchphrase smiley="🤓">
        De quoi <Keyword :big="false" primary bold>se préparer</Keyword> pour la rentrée
      </Catchphrase>
    </ShadowBox>

    <ShadowBox class="h-min bg-white/10">
      <LargeTitle>Les <Keyword big secondary>actualités</Keyword> de Saint
        Jean</LargeTitle>
      <div class="news-container no-scrollbar max-h-[60vh] overflow-y-scroll">
        <CenteredLoadingAnimation v-if="!newsFetched" animation-size="75%" />

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
// @ts-ignore
import Catchphrase from './Catchphrase.vue'
// @ts-ignore
import Keyword from '@/components/style/Keyword.vue'
// @ts-ignore
import Footer from '@/components/Footer.vue'
// @ts-ignore
import CenteredLoadingAnimation from '@/components/style/CenteredLoadingAnimation.vue'
// @ts-ignore
import ShadowBox from '@/components/style/ShadowBox.vue'
// @ts-ignore
import LargeTitle from '@/components/style/LargeTitle.vue'
// @ts-ignore
import SmallTitle from '@/components/style/SmallTitle.vue'
import { MessageStack, MessageType, pushError, pushInfo } from '../messages/message_stack'
import { databaseClient } from '@/database/implementation'
import { useRouter } from 'vue-router'
import getUrlParam from '@/utils/get_url_param'
import type { News } from '@/database/interface/news'
import { computed, ref } from 'vue'
import { LongDate } from '@/utils/long_date'

const router = useRouter()

const NUMBER_OF_FETCHED_NEWS = 5
const NUMBER_OF_CHAR_PER_NEWS = 137

const newsFetched = ref<boolean>(false)

if (getUrlParam('type') == 'signup')
  validateAccount(getUrlParam('access_token'))
if (getUrlParam('type') == 'recovery')
  recoverPassword(getUrlParam('access_token'))
if (getUrlParam('message') == 'Confirmation+link+accepted.+Please+proceed+to+confirm+link+sent+to+the+other+email')
  pushInfo('Lien de confirmation accepté: veuillez confirmez le lien envoyé à l\'autre adresse')
if (getUrlParam('error') == 'unauthorized_client')
  pushError('Le lien est invalide ou a expiré')

const sortedNews = computed(() =>
  databaseClient.fetchedNews.value
    .filter((news: News) => news.visible)
    .sort((a: News, b: News) => -1 * LongDate.compare(a.date, b.date)),
)

databaseClient.fetchNews(NUMBER_OF_FETCHED_NEWS, true).then((_) => {
  newsFetched.value = true
})

async function validateAccount(token: string): Promise<void> {
  await databaseClient.loginUsingToken(token)

  MessageStack.getInstance().push({
    text: 'Votre compte est vérifié, si besoin reconnectez-vous',
    type: MessageType.SUCCESS,
  })
}

async function recoverPassword(token: string): Promise<void> {
  router.push('/change-password/' + token)
}

function formatMessage(message: string) {
  return (
    message.slice(0, NUMBER_OF_CHAR_PER_NEWS) +
    (message.length > NUMBER_OF_CHAR_PER_NEWS ? '...' : '')
  )
}
</script>

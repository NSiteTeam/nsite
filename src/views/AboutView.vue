<template>
  <div class="p-8 md:p-16">
    <LargeTitle>A propos de ce site</LargeTitle>
    <div class="pl-4 border-l-2 border-l-white/10">
      <MediumTitle class="mt-8">Qui a créé ce site ?</MediumTitle>
      <p>
        Ce site a été codé en 2022 par trois élèves de la <Keyword :big="false" primary bold>classe de NSI</Keyword> de Saint Jean Hulst, à savoir <Keyword :big="false" primary bold>Laurian Fournier</Keyword>, <Keyword :big="false" primary bold>Eric de Malet</Keyword> et <Keyword :big="false" primary bold>Jean-Baptiste Dubois</Keyword>.
      </p>
      <MediumTitle class="mt-8">Peut-on voir le code de ce site ?</MediumTitle>
      <p>
        <Keyword :big="false" primary bold>Oui !</Keyword> Le code source du site est disponible sur <a :href='GITHUB_LINK'>GitHub</a>. Il
        est fourni sous licence <a class='text-marked text-blue-500 underline' :href='LICENSE_LINK'>{{ LICENSE_NAME }}</a>.
      </p>
      <MediumTitle class="mt-8">Peut-on contribuer à ce site ?</MediumTitle>
      <p>
        Egalement ! Il suffit d'ouvrir une <a class='text-marked' :href='GITHUB_LINK + "/issues"'>issue</a> ou une
        <a class='text-marked' :href='GITHUB_LINK + "/pulls"'>pull request</a> sur GitHub. Si vous avez une question,
        il est aussi possible de <a class='text-marked' href="mailto:laurian.fournier@gmail.com">nous contacter</a>.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LargeTitle from '@/components/style/LargeTitle.vue'
  import MediumTitle from '@/components/style/MediumTitle.vue'
  import Keyword from '../components/style/Keyword.vue'

  import { GITHUB_LINK, LICENSE_LINK, LICENSE_NAME } from '@/utils/links'
</script>

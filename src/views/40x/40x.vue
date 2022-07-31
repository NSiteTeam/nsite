<template>
  <div class='h-main w-screen flex flex-col md:items-center'>
    <div class='max-w-screen-md pt-16 lg:pt-24'>
      <div class="center w-full px-8">
        <img :src='image' class='w-full max-w-screen-lg' />
      </div>
      <div class='p-6'>
        <LargeTitle>
          {{ message }}
        </LargeTitle>
        <p class='text-lg italic'>
          {{ subtitle }} Voulez vous <RouterLink to='/' class='text-primary font-semibold'>
          retourner à l'accueil </RouterLink> ?
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LargeTitle from '@/components/style/LargeTitle.vue'
  import ActionIcon from '@/components/style/ActionIcon.vue'
  import { computed } from 'vue'

  const props = defineProps({
    forbidden: {
      type: Boolean,
      default: false
    }
  })

  const image = computed(() => {
    if (!props.forbidden) {
      return '/src/assets/404.svg'
    } else {
      return '/src/assets/403.svg'
    }
  })

  const message = computed(() => {
    if (!props.forbidden) {
      return 'Pas de chance, vous êtes sorti du domaine de définition du site !'
    } else {
      return 'Pas de chance, vous êtes tombé sur une valeur interdite durant votre navigation'
    }
  })

  const subtitle = computed(() => {
    if (!props.forbidden) {
      return 'Tout comme les figure que vous voyez, cette page n\'existe pas.'
    } else {
      return 'Tout comme les figure que vous voyez, cette page est impossible d\'accès.'
    }
  })
</script>

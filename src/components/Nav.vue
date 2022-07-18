<template>
  <header
    class="
      sticky top-0 z-30
      shadow-lg bg-gradient-to-r from-primary to-primary-light
      h-16
      flex items-center place-content-between
    "
  >
    <RouterLink
      to="/"
      class="flex items-center content-center"
    >
      <img
        src="../../src/assets/logo.svg"
        class="w-14 h-14 ml-4"
      />
      <MediumTitle class="hidden lg:block">Les mathématiques à Saint Jean Hulst</MediumTitle>
    </RouterLink>

    <nav class="h-full mr-6">
      <Overlay :on='menuToggled' />
      <div
        :class="{
          'flex': true,
          'h-full items-center': !isBelowMediumDevice,
          'hidden': isBelowMediumDevice && !menuToggled,
          'fixed top-0 right-0 z-50 m-4 py-4 pr-10 rounded-lg shadow-lg flex-col bg-primary items-start text-xl': isBelowMediumDevice && menuToggled
        }"
      >
        <!-- Close menu button -->
        <div
          :class="{
            'absolute top-0 right-0 m-6': true,
            'hidden': !isBelowMediumDevice || !menuToggled,
          }"
        >
          <span
            @click="menuToggled = false"
            class="material-icons cursor-pointer select-none float-right"
          >
            close
          </span>
        </div>
        <NavBarLink to="/browse" :minify='isBelowMediumDevice'>Parcourir</NavBarLink>
        <NavBarLink to="/timeline" :minify='isBelowMediumDevice'>Histoire</NavBarLink>
        <NavBarLink to="/login" :minify='isBelowMediumDevice' v-if='!connected'>Se connecter</NavBarLink>
        <NavBarLink to="/register" :minify='isBelowMediumDevice' v-if='!connected'>S'inscrire</NavBarLink>
        <NavBarLink to="/dashboard" :minify='isBelowMediumDevice' v-if='hasAccessToDashboard'>Gestion du site</NavBarLink>
        <NavBarLink to="/profile" :minify='isBelowMediumDevice'>
          <ProfilePicture v-if="connected" size="32px" />
        </NavBarLink>
      </div>

      <!-- Hamburger menu button -->
      <div
        :class="{
          'center h-full': isBelowMediumDevice,
          'hidden': !isBelowMediumDevice,
        }"
      >
        <span
          @click="menuToggled = !menuToggled"
          class="material-icons cursor-pointer select-none"
        >
          menu
        </span>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { ref } from '@vue/reactivity'
import { useWindowSize } from 'vue-window-size'
import { databaseClient } from '@/database/implementation'
import { useRoute } from 'vue-router'
import { computed, onMounted } from '@vue/runtime-core'
import ProfilePicture from '@/components/ProfilePicture.vue'
import MediumTitle from '@/components/style/MediumTitle.vue'
import Overlay from '@/components/style/Overlay.vue'
import NavBarLink from '@/components/style/NavBarLink.vue'

const MEDIUM_SIZE = 768 // This is the width of the medium device in the default tailwind config

const route = useRoute()
const { width: windowWidth } = useWindowSize()

const connected = databaseClient.isConnected
const menuToggled = ref(false)

function toggleMenuFunction() {
  menuToggled.value = !menuToggled.value
}

const hasAccessToDashboard = computed(
  () => databaseClient.isConnected.value && databaseClient.user.value?.permissions,
)

const isBelowMediumDevice = computed(() => windowWidth.value <= MEDIUM_SIZE)

watch(isBelowMediumDevice, (_) => {
  menuToggled.value = false
})

</script>

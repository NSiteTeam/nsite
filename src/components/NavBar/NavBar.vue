<template>
  <header
    class="
      sticky top-0 z-30
      bg-white border-b-2 border-gray-300 shadow-md
      h-header
      flex items-center place-content-between
    "
  >
    <RouterLink
      to="/"
      class="flex items-center content-center"
    >
      <img
        src="@/assets/logo.svg"
        class="w-14 h-14 ml-4"
      />
      <MediumTitle class="hidden lg:block">Les mathématiques à Saint Jean Hulst</MediumTitle>
    </RouterLink>

    <nav class="flex items-center h-full mr-6">
      <Overlay
        @close='menuToggled = false'
        :on='menuToggled'
      />
      <div
        :class="{
          'flex': true,
          'h-full items-center': !isBelowMediumDevice,
          'hidden': isBelowMediumDevice && !menuToggled,
          'fixed top-0 right-0 z-50 w-60 m-4 py-4 pr-20 rounded-lg shadow-lg flex-col bg-white items-start text-xl': isBelowMediumDevice && menuToggled
        }"
      >
        <CloseButton v-if='isBelowMediumDevice' :side='Side.TOP_RIGHT' @click='menuToggled = false' />
        <NavBarLink to="/browse" :minify='isBelowMediumDevice'>Parcourir</NavBarLink>
        <NavBarLink to="/timeline" :minify='isBelowMediumDevice'>Histoire</NavBarLink>
        <NavBarLink to="/login" :minify='isBelowMediumDevice' v-if='!connected'>Se connecter</NavBarLink>
        <NavBarLink to="/register" :minify='isBelowMediumDevice' v-if='!connected'>S'inscrire</NavBarLink>
        <NavBarLink to="/dashboard" :minify='isBelowMediumDevice' v-if='hasAccessToDashboard'>Gestion du site</NavBarLink>
        <NavBarLink to="/profile" :minify='isBelowMediumDevice' v-if="connected">
          <ProfilePicture size="32px" />
        </NavBarLink>
      </div>

      <!-- Hamburger menu button -->
      <ActionIcon
        icon='menu'
        v-if='isBelowMediumDevice'
        @click='menuToggled = !menuToggled'
      />
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
  import { Side } from '@/utils/sides'
  import ProfilePicture from '@/components/ProfilePicture.vue'
  import MediumTitle from '@/components/style/MediumTitle.vue'
  import Overlay from '@/components/style/Overlay.vue'
  import NavBarLink from '@/components/NavBar/NavBarLink.vue'
  import CloseButton from '@/components/style/CloseButton.vue'
  import ActionIcon from '@/components/style/ActionIcon.vue'

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

<template>
  <header
    class="
      sticky top-0 z-20
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
          'fixed top-0 right-0 z-40 w-60 m-4 py-4 pr-20 rounded-lg shadow-lg flex-col bg-white items-start text-xl': isBelowMediumDevice && menuToggled
        }"
      >
        <CloseButton v-if='isBelowMediumDevice' :side='Side.TOP_RIGHT' @click='menuToggled = false' />
        <NavBarLink to="/browse" :minify='isBelowMediumDevice'>Parcourir</NavBarLink>
        <NavBarLink to="/news" :minify='isBelowMediumDevice'>News</NavBarLink>
        <NavBarLink to="/timeline" :minify='isBelowMediumDevice'>Histoire</NavBarLink>
        <NavBarLink to="/login" :minify='isBelowMediumDevice' v-if='!connected'>Se connecter</NavBarLink>
        <NavBarLink to="/register" :minify='isBelowMediumDevice' v-if='!connected'>S'inscrire</NavBarLink>
        <NavBarLink to="/dashboard" :minify='isBelowMediumDevice' v-if='hasAccessToDashboard'>Gestion du site</NavBarLink>
        <ActionIcon v-if='connected' @click='logout' icon='logout' :class='{ "ml-4": isBelowMediumDevice }' />
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
  import useWindowSize from '@/utils/windows_size'
  import { databaseClient } from '@/database/implementation'
  import { useRoute, useRouter } from 'vue-router'
  import { computed, onMounted } from '@vue/runtime-core'
  import { Side } from '@/utils/sides'
  import MediumTitle from '@/components/style/MediumTitle.vue'
  import Overlay from '@/components/style/Overlay.vue'
  import NavBarLink from '@/components/NavBar/NavBarLink.vue'
  import CloseButton from '@/components/style/CloseButton.vue'
  import ActionIcon from '@/components/style/ActionIcon.vue'
  import { MessageStack, MessageType } from '@/views/messages/message_stack'

  const MEDIUM_SIZE = 768 // This is the width of the medium device in the default tailwind config

  const route = useRoute()
  const router = useRouter()
  const { width: windowWidth } = useWindowSize()

  const connected = databaseClient.isConnected
  const menuToggled = ref(false)

  const hasAccessToDashboard = ref(false)
  async function updateAccessToDashboard() {
    databaseClient
      .getPermissions()
      .then((permissions) => {
        hasAccessToDashboard.value = databaseClient.isConnected && permissions.length > 0
      })
  }

  updateAccessToDashboard()
  watch(databaseClient.isConnected, updateAccessToDashboard)

  const isBelowMediumDevice = computed(() => windowWidth.value <= MEDIUM_SIZE)

  watch(isBelowMediumDevice, (_) => {
    menuToggled.value = false
  })

  function toggleMenuFunction() {
    menuToggled.value = !menuToggled.value
  }

  function logout() {
    databaseClient.logout()
      .then(() => {
        MessageStack.getInstance().push({
          type: MessageType.SUCCESS,
          text: 'Vous êtes maintenant déconnecté',
        })

        router.push('/')
      })
      .catch((error) => {
        MessageStack.getInstance().push({
          type: MessageType.ERROR,
          text: error.message,
        })
      })
  }

</script>

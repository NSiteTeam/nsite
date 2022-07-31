<template>
  <Nav />
  <main>
    <Suspense>
      <RouterView />
    </Suspense>
    <MessagesView />
    <PopupView />
  </main>
</template>

<script setup lang="ts">
  import Nav from '@/components/NavBar/NavBar.vue'
  import MessagesView from '@/views/messages/MessagesView.vue'
  import PopupView from '@/views/popup/PopupView.vue'
</script>

<style lang="scss">
  @import './src/style/index.scss'
</style>

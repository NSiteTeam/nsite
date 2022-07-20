<template>
  <Nav />
  <main>
    <MessagesView />
    <Suspense>
      <RouterView />
    </Suspense>
  </main>
</template>

<script setup lang="ts">
  import Nav from '@/components/NavBar/NavBar.vue'
  import MessagesView from '@/components/MessagesView.vue'
</script>

<style lang="scss">
  @import './src/style/index.scss'
</style>

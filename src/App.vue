<script setup lang="ts">
// @ts-ignore Bug de vue
import Nav from './components/Nav.vue'
</script>

<template>
<!-- I'll activate loader as soon as possible !-->


  <!-- <Loader /> -->
  <Nav />
  <main>
    <Suspense>
      <RouterView />
    </Suspense>
  </main>
</template>

<style lang="scss">
@import './src/style/index.scss';
</style>

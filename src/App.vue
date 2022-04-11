<script setup lang="ts">
import Nav from "./components/Nav.vue";
</script>

<template>
  <Nav />
  <main>
    <RouterView />
  </main>
</template>

<style lang="scss">
  @import './src/assets/style/index.scss';
</style>

<script setup lang="ts">
// @ts-ignore
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

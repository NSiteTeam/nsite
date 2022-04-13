<script setup lang="ts">
import Nav from "./components/Nav.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <Nav />
  <main>
    <RouterView />
  </main>
  <Footer />
</template>

<style lang="scss">
  @import './src/assets/style/index.scss';
</style>

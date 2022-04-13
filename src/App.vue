<script setup lang="ts">
import Nav from "./components/Nav.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <Nav />
  <main>
    <RouterView />
  </main>
  <div class="wave" :class="this.$route.name == 'home' ? 'display-none' : 'display-block'"></div>
  <Footer />
</template>

<style lang="scss">
  @import './src/assets/style/index.scss';
</style>

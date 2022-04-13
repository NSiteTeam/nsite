<script setup lang="ts">
import { ref } from '@vue/reactivity';
import CatchLine from "./../components/CatchLine.vue";
import Levels from "./../components/Levels.vue";
import News from "./../components/News.vue";
import Footer from "../components/Footer.vue";
</script>

<template>
  <div id="home-container">
      <CatchLine />
      <News />
  </div>
  <div class="wave1"></div>
  <Levels />
  <div class="wave2"></div>
</template>

<template>
  <div class="relative bottom-0 z-20 w-full">
    <BarSeparator />
    <ul
      class="
        flex flex-col place-content-around sm:flex-row
        bold text-center
        p-12
      "
    >
      <li>
        <a href="mailto:laurian.fournier@gmail.com">Nous contacter</a>
      </li>
      <li><RouterLink to="/about">À propos de ce site</RouterLink></li>
      <li>
        <a href="https://www.saint-jean-hulst.com/">Saint Jean Hulst</a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import BarSeparator from '@/components/style/BarSeparator.vue'
</script>

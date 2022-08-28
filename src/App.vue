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

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer components {
    .input-style {
      @apply flex flex-row items-center overflow-clip rounded-lg border-4 bg-gray-500/20 p-4 text-2xl font-bold outline-none transition-colors focus-within:border-primary focus-within:bg-transparent;
    }
    .center {
      @apply flex justify-center items-center
    }
    .bold {
      @apply font-bold
    }
  }

</style>

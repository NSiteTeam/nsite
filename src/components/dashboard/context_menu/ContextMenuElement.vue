<template>
  <div class="context-menu-element">
    <span class="context-menu-element-icon material-icons">{{
      props["icon"]
    }}</span>
    <span class="context-menu-element-text">{{ props["message"] }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["icon", "message"]);
</script>

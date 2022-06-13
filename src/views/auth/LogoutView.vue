<script setup lang="ts">
import { databaseClient } from "@/database/implementation";
import { ref } from "vue";
import type { Ref } from "vue";

const message: Ref<string> = ref("Déconnexion");
const disconnectionSuccess = ref(false);
const isDisconnecting = ref(true);
const encounteredError = ref(false);

databaseClient.logout().then((success: boolean) => {
  if (success) {
    message.value = "Vous avez bien été déconnecté";
  } else {
    message.value =
      "Une erreur a été rencontrée durant la tentative de déconnexion";
    encounteredError.value = false;
  }

  disconnectionSuccess.value = success;
  isDisconnecting.value = false;
});
</script>

<template>
  <div id="disconnection-message">
    <p
      :class="{
        good: disconnectionSuccess,
        indication: isDisconnecting,
        error: encounteredError,
      }"
    >
      {{ message }}
    </p>
    <p id="homepage-message">
      <RouterLink v-if="!isDisconnecting" to="/">
        ⇒ Retourner à l'accueil
      </RouterLink>
    </p>
  </div>
</template>

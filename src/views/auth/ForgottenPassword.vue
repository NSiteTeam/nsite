<template>
<div class="forgotten-password-container">
  <h1>Mot de passe oublié ?</h1>
  <form @submit.prevent>
    <label for="email-input">Votre adresse email</label>
    <input type="text" name="email" placeholder="Email" />
    <input type="submit" value="Envoyer">
  </form>
</div>

</template>

<script setup lang="ts">

</script>

<template>
  <div class="login-container">
    <form id="register" @submit.prevent="handleRegister">
      <div class="good" v-if="!loading && success && !failure">
        Vérifiez votre adresse email pour vous connecter
      </div>
      <div v-else-if="!loading && failure && !success" class="error">
        {{ failure.message }}
      </div>
      <div class="indication" v-else-if="loading">
        Tentative de connection ...
      </div>
      <h2>S'inscrire</h2>
      <input
        type="username"
        v-model="username"
        placeholder="Nom d'utilisateur"
      />
      <input type="email" v-model="email" placeholder="Email" />
      <input type="password" v-model="password" placeholder="Mot de passe" />
      <input type="submit" value="S'inscrire" :disabled="loading" />
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { databaseClient } from "@/database/implementation";

const email = ref("");
const password = ref("");
const username = ref("");
const loading = ref(false);
const failure = ref(false);
const success = ref(false);

const errorMessages = {
  "Request Failed": `Impossible de joindre nos serveurs d'authentification. Vérifiez votre connection internet.`,
  "Password should be at least 6 characters": `Le mot de passe doit contenir au moins 6 caractères`,
  "User already registered": "L'utilisateur a déjà été inscrit",
};

async function handleRegister() {
  loading.value = true;
  console.log(username.value);
  const { error, accountCreated } = await databaseClient.signIn(
    email.value,
    password.value,
    username.value
  );
  loading.value = false;
  failure.value = error;
  success.value = accountCreated;

  // TODO: Ask to the user to verify his email
}
</script>

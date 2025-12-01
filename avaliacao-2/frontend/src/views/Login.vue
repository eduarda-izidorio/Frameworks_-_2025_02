<template>
  <v-container class="fill-height justify-center">
    <v-card class="pa-5" elevation="4" width="400">
      <v-card-title class="text-center">Entrar</v-card-title>
      <v-card-text class="text-center">
        <p>Faça login para acessar suas finanças.</p>
        <v-btn color="primary" class="mt-4" block @click="handleLogin">
          Entrar com Google
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

function handleLogin() {
  authStore.signInWithGoogle()
}
</script>

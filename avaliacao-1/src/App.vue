<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Minha Aplicação Vue</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" text>Início</v-btn>
      <v-btn to="/crud" text>CRUD</v-btn>
      <v-btn to="/sobre" text>Sobre</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
// Seus scripts, como importações
</script>
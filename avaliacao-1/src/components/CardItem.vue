<template>
  <v-card class="mx-auto" max-width="400">
    <v-card-item>
      <div>
        <div class="text-overline mb-1">{{ item.genre }}</div>
        <div class="text-h6 mb-1">{{ item.title }}</div>
        <div class="text-caption">Nota: {{ item.rating }}</div>
      </div>
    </v-card-item>

    <v-card-actions>
      <v-btn text color="primary">Editar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  item: {
    type: Object,
    required: true,
    // Garanta que o objeto tenha as propriedades necessárias
    validator: (value) => value.hasOwnProperty('title') && value.hasOwnProperty('genre') && value.hasOwnProperty('rating')
  },
});
</script>
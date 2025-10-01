<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 text-center mb-5">Biblioteca de Filmes e Jogos</h1>
      </v-col>
      
      <v-col cols="12" class="d-flex justify-center">
        <v-text-field
          v-model="searchQuery"
          label="Buscar por título..."
          prepend-inner-icon="mdi-magnify"
          clearable
          class="mr-4"
        ></v-text-field>
        <v-select
          v-model="sortCriteria"
          :items="sortOptions"
          label="Ordenar por"
        ></v-select>
      </v-col>
      
      <v-col
        v-for="item in filteredAndSortedItems"
        :key="item.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <CardItem :item="item" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import CardItem from '../components/CardItem.vue';
import { useLocalStorage } from '../composables/useLocalStorage';

const { items } = useLocalStorage('items');

const searchQuery = ref('');
const sortCriteria = ref('titulo');
const sortOptions = [
  { text: 'Título', value: 'titulo' },
  { text: 'Gênero', value: 'genero' },
  { text: 'Nota', value: 'nota' }
];

const filteredAndSortedItems = computed(() => {
  let filtered = items.value.filter(item => 
    item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  if (sortCriteria.value === 'titulo') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortCriteria.value === 'genero') {
    filtered.sort((a, b) => a.genre.localeCompare(b.genre));
  } else if (sortCriteria.value === 'nota') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return filtered;
});
</script>
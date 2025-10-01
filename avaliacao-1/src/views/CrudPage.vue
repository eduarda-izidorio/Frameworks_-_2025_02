<template>
  <v-container>
    <h1 class="text-h4 text-center mb-5">Adicionar/Editar Item</h1>
    
    <v-form @submit.prevent="saveItem">
      <v-text-field
        label="Título"
        v-model="currentItem.title"
        required
      ></v-text-field>
      <v-text-field
        label="Gênero"
        v-model="currentItem.genre"
        required
      ></v-text-field>
      <v-text-field
        label="Nota (0-10)"
        v-model.number="currentItem.rating"
        type="number"
        min="0"
        max="10"
        required
      ></v-text-field>
      
      <v-btn color="success" type="submit" class="mr-2">Salvar</v-btn>
      <v-btn color="error" @click="cancelForm">Cancelar</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLocalStorage } from '../composables/useLocalStorage'; // Você precisará criar este arquivo

const router = useRouter();
const { saveItem: saveItemToStorage } = useLocalStorage('items');
const currentItem = ref({});

const saveItem = () => {
  if (!currentItem.value.id) {
    currentItem.value.id = Date.now();
  }
  saveItemToStorage(currentItem.value);
  router.push('/');
};

const cancelForm = () => {
  router.push('/');
};
</script>
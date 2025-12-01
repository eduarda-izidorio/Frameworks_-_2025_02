<template>
  <v-container>
    <v-row class="mt-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h2>Gerenciar Categorias</h2>
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()">Nova Categoria</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in categories" :key="item.id">
                <td>{{ item.name }}</td>
                <td>
                  <v-chip :color="item.type === 'both' ? 'blue' : item.type === 'income' ? 'green' : 'red'" size="small" label>
                    {{ getTypeLabel(item.type) }}
                  </v-chip>
                </td>
                <td>
                  <v-btn icon="mdi-pencil" size="small" variant="text" color="blue" @click="openDialog(item)"></v-btn>
                  <v-btn icon="mdi-delete" size="small" variant="text" color="red" @click="deleteCategory(item.id)"></v-btn>
                </td>
              </tr>
              <tr v-if="categories.length === 0">
                <td colspan="3" class="text-center pa-4">Nenhuma categoria encontrada.</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Category Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="bg-primary text-white">
          <span class="text-h5">{{ editedIndex === -1 ? 'Nova Categoria' : 'Editar Categoria' }}</span>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-form ref="form" v-model="valid">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field 
                    v-model="editedItem.name" 
                    label="Nome da Categoria" 
                    :rules="[v => !!v || 'Nome é obrigatório']"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="editedItem.type"
                    :items="typeOptions"
                    item-title="text"
                    item-value="value"
                    label="Usado para"
                    required
                    variant="outlined"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" @click="saveCategory">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const categories = ref([])
const dialog = ref(false)
const valid = ref(false)
const form = ref(null)
const editedIndex = ref(-1)

const editedItem = ref({
  id: null,
  name: '',
  type: 'both'
})

const defaultItem = {
  id: null,
  name: '',
  type: 'both'
}

const typeOptions = [
  { text: 'Receitas e Despesas', value: 'both' },
  { text: 'Apenas Receitas', value: 'income' },
  { text: 'Apenas Despesas', value: 'expense' }
]

const API_URL = 'http://localhost:3000/categories'

onMounted(() => {
  fetchCategories()
})

function getTypeLabel(type) {
  const option = typeOptions.find(opt => opt.value === type)
  return option ? option.text : type
}

async function fetchCategories() {
  try {
    const response = await fetch(API_URL)
    if (response.ok) {
      categories.value = await response.json()
    }
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
  }
}

function openDialog(item) {
  if (item) {
    editedIndex.value = categories.value.indexOf(item)
    editedItem.value = Object.assign({}, item)
  } else {
    editedIndex.value = -1
    editedItem.value = Object.assign({}, defaultItem)
  }
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
  editedItem.value = Object.assign({}, defaultItem)
  editedIndex.value = -1
  if (form.value) form.value.resetValidation()
}

async function saveCategory() {
  const { valid } = await form.value.validate()
  if (!valid) return

  const method = editedIndex.value === -1 ? 'POST' : 'PUT'
  const url = editedIndex.value === -1 ? API_URL : `${API_URL}/${editedItem.value.id}`
  
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedItem.value),
    })

    if (response.ok) {
      await fetchCategories()
      closeDialog()
    } else {
      console.error('Erro ao salvar categoria')
    }
  } catch (error) {
    console.error('Erro ao salvar categoria:', error)
  }
}

async function deleteCategory(id) {
  if (confirm('Tem certeza que deseja excluir esta categoria?')) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        await fetchCategories()
      }
    } catch (error) {
      console.error('Erro ao excluir categoria:', error)
    }
  }
}
</script>

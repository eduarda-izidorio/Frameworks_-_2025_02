<template>
  <v-container class="mt-5">
    <!-- Summary Cards -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card color="green-lighten-1" class="text-white" elevation="4">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="text-h5">Receitas</v-card-title>
              <v-card-text class="text-h4">{{ formatCurrency(totalIncome) }}</v-card-text>
            </div>
            <v-avatar class="ma-3" size="80" rounded="0">
              <v-icon icon="mdi-arrow-up-circle" size="80"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card color="red-lighten-1" class="text-white" elevation="4">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="text-h5">Despesas</v-card-title>
              <v-card-text class="text-h4">{{ formatCurrency(totalExpense) }}</v-card-text>
            </div>
            <v-avatar class="ma-3" size="80" rounded="0">
              <v-icon icon="mdi-arrow-down-circle" size="80"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card color="blue-lighten-1" class="text-white" elevation="4">
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title class="text-h5">Saldo</v-card-title>
              <v-card-text class="text-h4">{{ formatCurrency(balance) }}</v-card-text>
            </div>
            <v-avatar class="ma-3" size="80" rounded="0">
              <v-icon icon="mdi-wallet" size="80"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Section -->
    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card elevation="2" title="Despesas por Categoria">
          <v-card-text>
            <div style="height: 300px; position: relative;">
              <Pie v-if="expenseChartData.labels.length" :data="expenseChartData" :options="chartOptions" />
              <div v-else class="d-flex justify-center align-center h-100 text-grey">Sem dados de despesas</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="2" title="Balanço Mensal">
          <v-card-text>
            <div style="height: 300px; position: relative;">
              <Bar v-if="balanceChartData.labels.length" :data="balanceChartData" :options="chartOptions" />
              <div v-else class="d-flex justify-center align-center h-100 text-grey">Sem dados de transações</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters and Search -->
    <v-row class="mt-6">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="search"
          label="Pesquisar (Descrição ou Categoria)"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="6" md="3">
        <v-select
          v-model="filterMonth"
          :items="months"
          label="Mês"
          variant="outlined"
          density="compact"
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="6" md="3">
        <v-select
          v-model="filterYear"
          :items="years"
          label="Ano"
          variant="outlined"
          density="compact"
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="12" md="2" class="d-flex justify-end">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openDialog()" block>Nova</v-btn>
      </v-col>
    </v-row>

    <!-- Transactions Table -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredTransactions" :key="item.id">
                <td>{{ formatDate(item.date) }}</td>
                <td>{{ item.description }}</td>
                <td>{{ item.category }}</td>
                <td>
                  <v-chip :color="item.type === 'income' ? 'green' : 'red'" size="small" label>
                    {{ item.type === 'income' ? 'Receita' : 'Despesa' }}
                  </v-chip>
                </td>
                <td :class="item.type === 'income' ? 'text-green font-weight-bold' : 'text-red font-weight-bold'">
                  {{ formatCurrency(item.amount) }}
                </td>
                <td>
                  <v-btn icon="mdi-pencil" size="small" variant="text" color="blue" @click="openDialog(item)"></v-btn>
                  <v-btn icon="mdi-delete" size="small" variant="text" color="red" @click="deleteTransaction(item.id)"></v-btn>
                </td>
              </tr>
              <tr v-if="filteredTransactions.length === 0">
                <td colspan="6" class="text-center pa-4">Nenhuma transação encontrada.</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Transaction Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="bg-primary text-white">
          <span class="text-h5">{{ editedIndex === -1 ? 'Nova Transação' : 'Editar Transação' }}</span>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-form ref="form" v-model="valid">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field 
                    v-model="editedItem.description" 
                    label="Descrição" 
                    :rules="[v => !!v || 'Descrição é obrigatória']"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="editedItem.type"
                    :items="typeOptions"
                    item-title="text"
                    item-value="value"
                    label="Tipo"
                    required
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field 
                    v-model="editedItem.amount" 
                    label="Valor" 
                    type="number" 
                    prefix="R$"
                    :rules="[v => !!v || 'Valor é obrigatório', v => v > 0 || 'Valor deve ser maior que zero']"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="editedItem.category" 
                    :items="categoryOptions"
                    label="Categoria"
                    :rules="[v => !!v || 'Categoria é obrigatória']"
                    required
                    variant="outlined"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field 
                    v-model="editedItem.date" 
                    label="Data" 
                    type="date"
                    required
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" variant="elevated" @click="saveTransaction">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Pie, Bar } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const transactions = ref([])
const categories = ref([])
const dialog = ref(false)
const valid = ref(false)
const form = ref(null)
const editedIndex = ref(-1)

// Search and Filter State
const search = ref('')
const filterMonth = ref(new Date().getMonth() + 1)
const filterYear = ref(new Date().getFullYear())

const months = [
  { title: 'Janeiro', value: 1 }, { title: 'Fevereiro', value: 2 }, { title: 'Março', value: 3 },
  { title: 'Abril', value: 4 }, { title: 'Maio', value: 5 }, { title: 'Junho', value: 6 },
  { title: 'Julho', value: 7 }, { title: 'Agosto', value: 8 }, { title: 'Setembro', value: 9 },
  { title: 'Outubro', value: 10 }, { title: 'Novembro', value: 11 }, { title: 'Dezembro', value: 12 }
]
const years = [2024, 2025, 2026]

const editedItem = ref({
  id: null,
  description: '',
  amount: '',
  type: 'expense',
  category: '',
  date: new Date().toISOString().substr(0, 10)
})

const defaultItem = {
  id: null,
  description: '',
  amount: '',
  type: 'expense',
  category: '',
  date: new Date().toISOString().substr(0, 10)
}

const typeOptions = [
  { text: 'Receita', value: 'income' },
  { text: 'Despesa', value: 'expense' }
]


const categoryOptions = computed(() => {
  return categories.value
    .filter(cat => cat.type === 'both' || cat.type === editedItem.value.type)
    .map(cat => cat.name)
})

// API URLs
const API_URL = 'http://localhost:3000/transactions'
const CATEGORIES_API_URL = 'http://localhost:3000/categories'


// Computed Properties for Filtering
const filteredTransactions = computed(() => {
  return transactions.value.filter(item => {
    const date = new Date(item.date)
    // Adjust for timezone if needed, but simple comparison works if dates are YYYY-MM-DD
    // Here we parse the date string parts to avoid timezone issues
    const [y, m, d] = item.date.split('-').map(Number)
    
    const matchesMonth = m === filterMonth.value
    const matchesYear = y === filterYear.value
    
    const matchesSearch = search.value 
      ? item.description.toLowerCase().includes(search.value.toLowerCase()) || 
        item.category.toLowerCase().includes(search.value.toLowerCase())
      : true

    return matchesMonth && matchesYear && matchesSearch
  })
})

const totalIncome = computed(() => {
  return filteredTransactions.value
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount), 0)
})

const totalExpense = computed(() => {
  return filteredTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount), 0)
})

const balance = computed(() => totalIncome.value - totalExpense.value)

// Chart Data
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

const expenseChartData = computed(() => {
  const expenses = filteredTransactions.value.filter(t => t.type === 'expense')
  const categories = {}
  
  expenses.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + Number(t.amount)
  })

  return {
    labels: Object.keys(categories),
    datasets: [{
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      data: Object.values(categories)
    }]
  }
})

const balanceChartData = computed(() => {
  return {
    labels: ['Receitas', 'Despesas'],
    datasets: [{
      label: 'Total',
      backgroundColor: ['#4CAF50', '#F44336'],
      data: [totalIncome.value, totalExpense.value]
    }]
  }
})

onMounted(() => {
  fetchTransactions()
  fetchCategories()
})

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const userTimezoneOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString('pt-BR')
}

async function fetchTransactions() {
  try {
    const response = await fetch(API_URL)
    if (response.ok) {
      transactions.value = await response.json()
    }
  } catch (error) {
    console.error('Erro ao buscar transações:', error)
  }
}

async function fetchCategories() {
  try {
    const response = await fetch(CATEGORIES_API_URL)
    if (response.ok) {
      categories.value = await response.json()
    }
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
  }
}


function openDialog(item) {
  if (item) {
    editedIndex.value = transactions.value.indexOf(item)
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

async function saveTransaction() {
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
      await fetchTransactions()
      closeDialog()
    } else {
      console.error('Erro ao salvar transação')
    }
  } catch (error) {
    console.error('Erro ao salvar transação:', error)
  }
}

async function deleteTransaction(id) {
  if (confirm('Tem certeza que deseja excluir esta transação?')) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        await fetchTransactions()
      }
    } catch (error) {
      console.error('Erro ao excluir transação:', error)
    }
  }
}
</script>

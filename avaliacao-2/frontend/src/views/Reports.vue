<template>
  <v-container>
    <v-row class="mt-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h2>Relatórios Financeiros</h2>
        <v-btn color="primary" prepend-icon="mdi-download" @click="exportToCSV">Exportar CSV</v-btn>
      </v-col>
    </v-row>

    <!-- Filters Section -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>Filtros</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filters.search"
                  label="Buscar Descrição"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="2">
                <v-text-field
                  v-model="filters.dateStart"
                  label="Data Inicial"
                  type="date"
                  variant="outlined"
                  density="compact"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="2">
                <v-text-field
                  v-model="filters.dateEnd"
                  label="Data Final"
                  type="date"
                  variant="outlined"
                  density="compact"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <v-select
                  v-model="filters.type"
                  :items="typeFilterOptions"
                  label="Tipo"
                  variant="outlined"
                  density="compact"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.category"
                  :items="categoryList"
                  label="Categoria"
                  variant="outlined"
                  density="compact"
                  clearable
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" md="2">
                <v-text-field
                  v-model="filters.minValue"
                  label="Valor Mínimo"
                  type="number"
                  prefix="R$"
                  variant="outlined"
                  density="compact"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="6" md="2">
                <v-text-field
                  v-model="filters.maxValue"
                  label="Valor Máximo"
                  type="number"
                  prefix="R$"
                  variant="outlined"
                  density="compact"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2" class="d-flex align-center">
                <v-btn color="error" variant="outlined" @click="clearFilters" block>Limpar Filtros</v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Summary Cards -->
    <v-row>
      <v-col cols="12" md="3">
        <v-card color="green" variant="tonal" elevation="2">
          <v-card-title class="text-h6">Total de Receitas</v-card-title>
          <v-card-text class="text-h4">{{ formatCurrency(totalIncome) }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="red" variant="tonal" elevation="2">
          <v-card-title class="text-h6">Total de Despesas</v-card-title>
          <v-card-text class="text-h4">{{ formatCurrency(totalExpense) }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="blue" variant="tonal" elevation="2">
          <v-card-title class="text-h6">Saldo Total</v-card-title>
          <v-card-text class="text-h4">{{ formatCurrency(balance) }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="purple" variant="tonal" elevation="2">
          <v-card-title class="text-h6">Transações</v-card-title>
          <v-card-text class="text-h4">{{ transactions.length }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Despesas por Categoria</v-card-title>
          <v-card-text>
            <div style="height: 400px; position: relative;">
              <Pie v-if="expenseChartData.labels.length" :data="expenseChartData" :options="chartOptions" />
              <div v-else class="d-flex justify-center align-center h-100 text-grey">Sem dados de despesas</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Receitas por Categoria</v-card-title>
          <v-card-text>
            <div style="height: 400px; position: relative;">
              <Pie v-if="incomeChartData.labels.length" :data="incomeChartData" :options="chartOptions" />
              <div v-else class="d-flex justify-center align-center h-100 text-grey">Sem dados de receitas</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Top Categories Tables -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Top 5 Categorias de Despesas</v-card-title>
          <v-card-text>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th class="text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in topExpenses" :key="item.category">
                  <td>{{ item.category }}</td>
                  <td class="text-right font-weight-bold text-red">{{ formatCurrency(item.total) }}</td>
                </tr>
                <tr v-if="topExpenses.length === 0">
                  <td colspan="2" class="text-center">Sem dados</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Top 5 Categorias de Receitas</v-card-title>
          <v-card-text>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th class="text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in topIncome" :key="item.category">
                  <td>{{ item.category }}</td>
                  <td class="text-right font-weight-bold text-green">{{ formatCurrency(item.total) }}</td>
                </tr>
                <tr v-if="topIncome.length === 0">
                  <td colspan="2" class="text-center">Sem dados</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

const transactions = ref([])
const API_URL = 'http://localhost:3000/transactions'

const filters = ref({
  search: '',
  dateStart: '',
  dateEnd: '',
  type: null,
  category: null,
  minValue: null,
  maxValue: null
})

const typeFilterOptions = [
  { title: 'Receitas', value: 'income' },
  { title: 'Despesas', value: 'expense' }
]

const categoryList = computed(() => {
  const categories = new Set()
  transactions.value.forEach(t => categories.add(t.category))
  return Array.from(categories).sort()
})

const filteredTransactions = computed(() => {
  return transactions.value.filter(t => {
    // Search filter
    if (filters.value.search && !t.description.toLowerCase().includes(filters.value.search.toLowerCase())) {
      return false
    }
    
    // Date range filter
    if (filters.value.dateStart) {
      const tDate = new Date(t.date)
      const startDate = new Date(filters.value.dateStart)
      if (tDate < startDate) return false
    }
    if (filters.value.dateEnd) {
      const tDate = new Date(t.date)
      const endDate = new Date(filters.value.dateEnd)
      if (tDate > endDate) return false
    }
    
    // Type filter
    if (filters.value.type && t.type !== filters.value.type) {
      return false
    }
    
    // Category filter
    if (filters.value.category && t.category !== filters.value.category) {
      return false
    }
    
    // Value range filter
    const amount = Number(t.amount)
    if (filters.value.minValue !== null && filters.value.minValue !== '' && amount < Number(filters.value.minValue)) {
      return false
    }
    if (filters.value.maxValue !== null && filters.value.maxValue !== '' && amount > Number(filters.value.maxValue)) {
      return false
    }
    
    return true
  })
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false
}

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

const expenseChartData = computed(() => {
  const expenses = filteredTransactions.value.filter(t => t.type === 'expense')
  const categories = {}
  
  expenses.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + Number(t.amount)
  })

  return {
    labels: Object.keys(categories),
    datasets: [{
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#8DD1E1'],
      data: Object.values(categories)
    }]
  }
})

const incomeChartData = computed(() => {
  const income = filteredTransactions.value.filter(t => t.type === 'income')
  const categories = {}
  
  income.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + Number(t.amount)
  })

  return {
    labels: Object.keys(categories),
    datasets: [{
      backgroundColor: ['#4CAF50', '#8BC34A', '#CDDC39', '#66BB6A', '#81C784', '#A5D6A7'],
      data: Object.values(categories)
    }]
  }
})

const topExpenses = computed(() => {
  const expenses = filteredTransactions.value.filter(t => t.type === 'expense')
  const categories = {}
  
  expenses.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + Number(t.amount)
  })

  return Object.entries(categories)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
})

const topIncome = computed(() => {
  const income = filteredTransactions.value.filter(t => t.type === 'income')
  const categories = {}
  
  income.forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + Number(t.amount)
  })

  return Object.entries(categories)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
})

onMounted(() => {
  fetchTransactions()
})

function clearFilters() {
  filters.value = {
    search: '',
    dateStart: '',
    dateEnd: '',
    type: null,
    category: null,
    minValue: null,
    maxValue: null
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
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

function exportToCSV() {
  // Helper to escape CSV fields
  const escapeField = (field) => {
    if (field === null || field === undefined) return ''
    const str = String(field)
    // Wrap in quotes if contains semicolon, quotes, or newlines
    if (str.includes(';') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }
  
  // Prepare CSV header
  const header = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']
  
  // Prepare CSV rows
  const rows = filteredTransactions.value.map(t => [
    escapeField(new Date(t.date).toLocaleDateString('pt-BR')),
    escapeField(t.description),
    escapeField(t.category),
    escapeField(t.type === 'income' ? 'Receita' : 'Despesa'),
    escapeField(Number(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
  ])
  
  // Add summary rows
  rows.push([])
  rows.push([escapeField('RESUMO')])
  rows.push([
    escapeField('Total de Receitas'), '', '', '', 
    escapeField(totalIncome.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
  ])
  rows.push([
    escapeField('Total de Despesas'), '', '', '', 
    escapeField(totalExpense.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
  ])
  rows.push([
    escapeField('Saldo'), '', '', '', 
    escapeField(balance.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
  ])
  
  // Combine header and rows using semicolon separator (better for Brazilian Excel)
  const csvContent = [
    header.join(';'),
    ...rows.map(row => row.join(';'))
  ].join('\r\n')
  
  // Create and download file with proper BOM for Excel
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `relatorio_financeiro_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

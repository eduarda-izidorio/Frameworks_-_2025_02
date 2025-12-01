<template>
  <v-app>
    <v-navigation-drawer v-if="isAuthenticated" v-model="drawer" app>
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/"></v-list-item>
        <v-list-item prepend-icon="mdi-chart-bar" title="Relatórios" to="/reports"></v-list-item>
        <v-list-item prepend-icon="mdi-shape" title="Categorias" to="/categories"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar v-if="isAuthenticated" color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Sistema Financeiro</v-app-bar-title>
      <template v-slot:append>
        <div v-if="user" class="d-flex align-center">
          <v-avatar size="32" class="mr-2">
            <v-img :src="user.user_metadata.avatar_url" alt="Avatar"></v-img>
          </v-avatar>
          <span class="mr-4">{{ user.user_metadata.full_name }}</span>
          <v-btn icon="mdi-logout" variant="text" @click="handleLogout" title="Sair"></v-btn>
        </div>
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const drawer = ref(true)

const user = computed(() => authStore.user)
const isAuthenticated = computed(() => !!authStore.user)

function handleLogout() {
  authStore.signOut()
  router.push('/login')
}
</script>

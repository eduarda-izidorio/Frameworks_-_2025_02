import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: () => import('../views/Dashboard.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue'),
        },
        {
            path: '/categories',
            name: 'categories',
            component: () => import('../views/Categories.vue'),
        },
        {
            path: '/reports',
            name: 'reports',
            component: () => import('../views/Reports.vue'),
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const { useAuthStore } = await import('../stores/auth')
    const authStore = useAuthStore()

    // Ensure auth is initialized
    if (!authStore.user && !authStore.session) {
        await authStore.initializeAuth()
    }

    const isAuthenticated = !!authStore.user

    if (to.name !== 'login' && !isAuthenticated) {
        next({ name: 'login' })
    } else if (to.name === 'login' && isAuthenticated) {
        next({ name: 'dashboard' })
    } else {
        next()
    }
})

export default router

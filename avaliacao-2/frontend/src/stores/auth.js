import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const session = ref(null)

    // Initialize auth state
    async function initializeAuth() {
        const { data } = await supabase.auth.getSession()
        session.value = data.session
        user.value = data.session?.user || null

        supabase.auth.onAuthStateChange((_event, _session) => {
            session.value = _session
            user.value = _session?.user || null

            if (!_session) {
                router.push('/login')
            }
        })
    }

    async function signInWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        })
        if (error) console.error('Login error:', error)
    }

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) console.error('Logout error:', error)
        else {
            user.value = null
            session.value = null
            router.push('/login')
        }
    }

    return { user, session, initializeAuth, signInWithGoogle, signOut }
})

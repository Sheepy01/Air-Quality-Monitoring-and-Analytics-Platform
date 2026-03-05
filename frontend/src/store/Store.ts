import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  token: string | null
  refreshToken: string | null
  user: {
    id: string
    email: string
    role: 'user' | 'admin'
  } | null
  isAuthenticated: boolean
  login: (tokens: { access: string; refresh: string }, user: any) => void
  logout: () => void
  setTokens: (access: string, refresh: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      
      login: (tokens, user) => {
        localStorage.setItem('accessToken', tokens.access)
        localStorage.setItem('refreshToken', tokens.refresh)
        set({
          token: tokens.access,
          refreshToken: tokens.refresh,
          user,
          isAuthenticated: true,
        })
      },
      
      logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        })
      },
      
      setTokens: (access, refresh) => {
        localStorage.setItem('accessToken', access)
        localStorage.setItem('refreshToken', refresh)
        set({
          token: access,
          refreshToken: refresh,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)
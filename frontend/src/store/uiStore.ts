import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  themeMode: 'light' | 'dark'
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  themeMode: 'light',
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  toggleTheme: () => set((state) => ({ 
    themeMode: state.themeMode === 'light' ? 'dark' : 'light' 
  })),
  setTheme: (theme) => set({ themeMode: theme }),
}))
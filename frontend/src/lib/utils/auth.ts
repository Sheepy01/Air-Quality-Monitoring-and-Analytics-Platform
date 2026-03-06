// src/lib/utils/auth.ts
export const authUtils = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)
  },
  
  clearTokens: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },
  
  logout: () => {
    authUtils.clearTokens()
    window.location.href = '/login'
  },
  
  isAuthenticated: () => {
    return !!authUtils.getAccessToken()
  }
}
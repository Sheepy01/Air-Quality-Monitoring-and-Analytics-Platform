// src/components/auth/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { authUtils } from '@/lib/utils/auth'

export function ProtectedRoute() {
  const isAuthenticated = authUtils.isAuthenticated()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <Outlet />
}
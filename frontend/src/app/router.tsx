import { Routes, Route } from 'react-router-dom'
import { ROUTES } from './config'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

export function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected Routes with MainLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.AQI} element={<div>AQI Page (Coming Soon)</div>} />
          <Route path={ROUTES.POLLUTANTS} element={<div>Pollutants Page (Coming Soon)</div>} />
          <Route path={ROUTES.HEALTH} element={<div>Health Page (Coming Soon)</div>} />
          <Route path={ROUTES.MAP} element={<div>Map Page (Coming Soon)</div>} />
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.ADMIN} element={<div>Admin Page (Coming Soon)</div>} />
            <Route path={ROUTES.EXPORT} element={<div>Export Page (Coming Soon)</div>} />
          </Route>
        </Route>
      </Route>
      
      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
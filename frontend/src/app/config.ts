export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'Air Quality Platform',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  apiUrl: import.meta.env.VITE_API_BASE_URL,
} as const

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  AQI: '/aqi',
  POLLUTANTS: '/pollutants',
  HEALTH: '/health',
  MAP: '/map',
  ADMIN: '/admin',
  EXPORT: '/export',
} as const
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  AQI: {
    SUMMARY: '/aqi/summary',
    TIMESERIES: '/aqi/timeseries',
    DISTRICTS: '/aqi/districts',
    RANKING: '/aqi/ranking',
  },
  POLLUTANTS: {
    DATA: '/pollutants/data',
    COMPARISON: '/pollutants/comparison',
    TRENDS: '/pollutants/trends',
  },
  HEALTH: {
    RISK_SCORES: '/health/risk-scores',
    ADVISORIES: '/health/advisories',
    EXPOSURE: '/health/exposure',
  },
  REPORTS: {
    EXCEL: '/reports/excel',
    PDF: '/reports/pdf',
  },
  CHAT: {
    MESSAGE: '/chat/message',
    HISTORY: '/chat/history',
  },
} as const
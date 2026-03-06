// src/pages/RegisterPage.tsx
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthCard } from '@/components/auth/AuthCard'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'
import { authUtils } from '@/lib/utils/auth'
import { Wind, Cloud, Sun, CloudRain } from 'lucide-react'

export function RegisterPage() {
  const navigate = useNavigate()
  
  useEffect(() => {
    if (authUtils.isAuthenticated()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 dark:from-gray-950 dark:via-emerald-950/20 dark:to-gray-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-900/20"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-900/20"></div>
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200/20 blur-3xl dark:bg-sky-900/10"></div>
      </div>

      {/* Floating icons */}
      <div className="absolute top-20 left-20 animate-float">
        <Wind className="h-12 w-12 text-emerald-300/40 dark:text-emerald-700/30" />
      </div>
      <div className="absolute bottom-20 right-20 animate-float-delayed">
        <Cloud className="h-16 w-16 text-teal-300/40 dark:text-teal-700/30" />
      </div>
      <div className="absolute top-40 right-40 animate-float-slow">
        <Sun className="h-10 w-10 text-amber-300/40 dark:text-amber-700/30" />
      </div>
      <div className="absolute bottom-40 left-40 animate-float">
        <CloudRain className="h-14 w-14 text-sky-300/40 dark:text-sky-700/30" />
      </div>

      <div className="relative container mx-auto px-4 min-h-screen flex items-center justify-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl">
          {/* Left side - Environmental message */}
          <div className="hidden lg:block space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 backdrop-blur px-4 py-2 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Join Research Community
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
                Start Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                  Air Quality Research
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Create an account to access comprehensive air quality data, 
                advanced analytics tools, and research collaboration features.
              </p>
            </div>

            <div className="space-y-4 pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 p-1 dark:bg-emerald-900/30">
                  <div className="h-5 w-5 rounded-full bg-emerald-500"></div>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Access to 38 districts data</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-teal-100 p-1 dark:bg-teal-900/30">
                  <div className="h-5 w-5 rounded-full bg-teal-500"></div>
                </div>
                <span className="text-gray-700 dark:text-gray-300">Export reports & visualizations</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-sky-100 p-1 dark:bg-sky-900/30">
                  <div className="h-5 w-5 rounded-full bg-sky-500"></div>
                </div>
                <span className="text-gray-700 dark:text-gray-300">AI-powered research assistant</span>
              </div>
            </div>
          </div>

          {/* Right side - Register Card */}
          <div className="flex justify-center">
            <AuthCard title="Create account" description="Join the research platform">
              <RegisterForm />
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <GoogleAuthButton />
              
              <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Sign in
                </Link>
              </p>
            </AuthCard>
          </div>
        </div>
      </div>
    </div>
  )
}
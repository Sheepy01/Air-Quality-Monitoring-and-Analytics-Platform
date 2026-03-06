// src/components/auth/RegisterForm.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, User, Mail, Lock } from 'lucide-react'
import { api } from '@/services/api'

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await api.post('/auth/register', {
        username: data.username,
        email: data.email,
        password: data.password,
      })
      
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Alert className="border-emerald-500 bg-emerald-50 text-emerald-700">
        <AlertDescription>
          Registration successful! Redirecting to login...
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="username"
            type="text"
            placeholder="johndoe"
            className="pl-9"
            {...register('username')}
          />
        </div>
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            className="pl-9"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="pl-9"
            {...register('password')}
          />
        </div>
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      
      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>
    </form>
  )
}
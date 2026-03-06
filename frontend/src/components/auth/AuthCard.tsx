
import { Card } from '@/components/ui/card'
import { Leaf } from 'lucide-react'

interface AuthCardProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md border-0 bg-white/90 backdrop-blur-sm dark:bg-gray-900/90 p-8 shadow-2xl">
      <div className="mb-6 flex items-center gap-2">
        <div className="rounded-xl bg-emerald-100 p-2 dark:bg-emerald-900/30">
          <Leaf className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Air Quality Bihar
        </h1>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      
      {children}
    </Card>
  )
}
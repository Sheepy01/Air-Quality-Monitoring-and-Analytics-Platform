import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Menu, Leaf, Moon, Sun } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'

export function Navbar() {
  const { sidebarOpen, toggleSidebar, themeMode, toggleTheme } = useUIStore()
  const { isAuthenticated, user, logout } = useAuthStore()
  
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mr-4"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <Link to="/" className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg hidden sm:inline-block">
            Air Quality Bihar
          </span>
        </Link>
        
        <div className="flex-1" />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="mr-2"
        >
          {themeMode === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
        
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden md:inline-block">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <Button asChild size="sm">
            <Link to="/">Login</Link>
          </Button>
        )}
      </div>
    </nav>
  )
}
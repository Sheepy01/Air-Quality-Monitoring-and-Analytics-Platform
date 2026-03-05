import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Activity, 
  Wind, 
  Heart, 
  Map, 
  FileText,
  Shield
} from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useAuthStore } from '@/store/authStore'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AQI Analytics', href: '/aqi', icon: Activity },
  { name: 'Pollutants', href: '/pollutants', icon: Wind },
  { name: 'Health Risk', href: '/health', icon: Heart },
  { name: 'Map View', href: '/map', icon: Map },
]

const adminNavigation = [
  { name: 'Admin Panel', href: '/admin', icon: Shield },
  { name: 'Export Data', href: '/export', icon: FileText },
]

export function Sidebar() {
  const { sidebarOpen } = useUIStore()
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      <nav className="flex flex-col h-full p-2">
        <div className="flex-1 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  !sidebarOpen && "justify-center"
                )
              }
            >
              <item.icon className={cn("h-5 w-5", !sidebarOpen && "mr-0")} />
              {sidebarOpen && <span className="ml-3">{item.name}</span>}
            </NavLink>
          ))}
          
          {isAdmin && (
            <>
              <div className="my-2 border-t" />
              {adminNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      !sidebarOpen && "justify-center"
                    )
                  }
                >
                  <item.icon className={cn("h-5 w-5", !sidebarOpen && "mr-0")} />
                  {sidebarOpen && <span className="ml-3">{item.name}</span>}
                </NavLink>
              ))}
            </>
          )}
        </div>
      </nav>
    </aside>
  )
}
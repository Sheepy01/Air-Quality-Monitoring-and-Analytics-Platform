import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { Footer } from './Footer'
import { useUIStore } from '@/store/uiStore'

export function MainLayout() {
  const { sidebarOpen } = useUIStore()
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="container mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
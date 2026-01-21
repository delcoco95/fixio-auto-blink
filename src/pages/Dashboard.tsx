import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { DashboardOverview } from './dashboard/DashboardOverview'
import { DashboardVehicles } from './dashboard/DashboardVehicles'
import { ProDashboard } from './pro/ProDashboard'
import { AdminDashboard } from './admin/AdminDashboard'
import { LayoutDashboard, Car, Calendar, Star, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

const NAV_ITEMS = [
  { id: 'overview', name: 'Aperçu', path: '/dashboard', icon: LayoutDashboard },
  { id: 'bookings', name: 'Mes réservations', path: '/dashboard/bookings', icon: Calendar },
  { id: 'vehicles', name: 'Mes véhicules', path: '/dashboard/vehicles', icon: Car },
  { id: 'reviews', name: 'Mes avis', path: '/dashboard/reviews', icon: Star },
  { id: 'settings', name: 'Paramètres', path: '/dashboard/settings', icon: Settings },
]

export function Dashboard() {
  const location = useLocation()
  const { profile } = useAuth()

  if (profile?.role === 'admin') {
    return <AdminDashboard />
  }

  if (profile?.role === 'pro') {
    return <ProDashboard />
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
          <div className="bg-muted/30 p-2 rounded-2xl border border-muted flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    isActive
                      ? "bg-white text-primary shadow-sm ring-1 ring-primary/5"
                      : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
                  )}
                >
                  <item.icon size={18} className={isActive ? "text-primary" : "text-muted-foreground"} />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/vehicles" element={<DashboardVehicles />} />
            <Route path="/bookings" element={<div className="p-20 text-center bg-muted/20 rounded-[3rem]">Section Réservations en cours de développement...</div>} />
            <Route path="/reviews" element={<div className="p-20 text-center bg-muted/20 rounded-[3rem]">Section Avis en cours de développement...</div>} />
            <Route path="/settings" element={<div className="p-20 text-center bg-muted/20 rounded-[3rem]">Section Paramètres en cours de développement...</div>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

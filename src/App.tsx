import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { SearchResults } from '@/pages/SearchResults'
import { ProProfile } from '@/pages/ProProfile'
import { ProLanding } from '@/pages/ProLanding'
import { ProRegistration } from '@/pages/pro/ProRegistration'
import { ProDashboard } from '@/pages/pro/ProDashboard'
import { Dashboard } from '@/pages/Dashboard'
import { Auth } from '@/pages/Auth'
import { VerifyEmail } from '@/pages/VerifyEmail'
import { useAuth } from '@/hooks/use-auth'
import { Navigate } from 'react-router-dom'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'

function App() {
  const { isLoading, profile, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={!isAuthenticated ? <Auth /> : <Navigate to="/" />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/pro/:id" element={<ProProfile />} />
        <Route path="/pro-landing" element={<ProLanding />} />
        
        {/* Professional Routes */}
        <Route 
          path="/pro/register" 
          element={isAuthenticated && profile?.role === 'pro' ? <ProRegistration /> : <Navigate to="/auth?mode=signup" />} 
        />
        <Route 
          path="/pro/dashboard" 
          element={isAuthenticated && profile?.role === 'pro' ? <ProDashboard /> : <Navigate to="/auth" />} 
        />

        {/* Client Routes */}
        <Route 
          path="/dashboard/*" 
          element={isAuthenticated && profile?.role === 'client' ? <Dashboard /> : <Navigate to="/auth" />} 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={isAuthenticated && profile?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
        />
      </Routes>
    </Layout>
  )
}

export default App
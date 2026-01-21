import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { SearchResults } from '@/pages/SearchResults'
import { ProProfile } from '@/pages/ProProfile'
import { ProLanding } from '@/pages/ProLanding'
import { ProRegistration } from '@/pages/pro/ProRegistration'
import { ProDashboard } from '@/pages/pro/ProDashboard'
import { Dashboard } from '@/pages/Dashboard'
import { useAuth } from '@/hooks/use-auth'

function App() {
  const { isLoading } = useAuth()

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
        <Route path="/search" element={<SearchResults />} />
        <Route path="/pro/:id" element={<ProProfile />} />
        <Route path="/pro-landing" element={<ProLanding />} />
        <Route path="/pro/register" element={<ProRegistration />} />
        <Route path="/pro/dashboard" element={<ProDashboard />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Layout>
  )
}

export default App
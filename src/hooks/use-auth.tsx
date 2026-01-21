import { createContext, useContext, useEffect, useState } from 'react'
import { blink } from '@/lib/blink'
import type { BlinkUser } from '@blinkdotnew/sdk'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

interface UserProfile {
  id: string
  email: string
  role: 'client' | 'pro' | 'admin'
  displayName: string | null
  phone: string | null
}

interface AuthContextType {
  user: BlinkUser | null
  profile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (params: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<BlinkUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      setUser(state.user)
      
      if (state.user) {
        try {
          const users = await blink.db.users.list({
            where: { id: state.user.id }
          }) as any[]

          if (users.length > 0) {
            setProfile(users[0])
          } else {
            // Get role and metadata from state.user
            const metadata = state.user.metadata || {}
            const role = state.user.email === 'nedjpro06@gmail.com' ? 'admin' : (metadata.role || 'client')
            
            const newProfile = await blink.db.users.create({
              id: state.user.id,
              userId: state.user.id,
              email: state.user.email,
              role,
              displayName: state.user.displayName || null,
              phone: metadata.phone || null,
              metadata: JSON.stringify(metadata)
            }) as UserProfile
            setProfile(newProfile)

            // If pro, create professional entry
            if (role === 'pro') {
              await blink.db.professionals.create({
                userId: state.user.id,
                name: metadata.garageName || state.user.displayName || 'Nouveau Garage',
                address: metadata.address || '',
                siret: metadata.siret || '',
                phone: metadata.phone || '',
                status: 'pending', // Admins need to validate
                is_active: 0,
                is_verified: 0,
                rating: 0,
                review_count: 0
              })
            }
          }
        } catch (error) {
          console.error('Error fetching/creating profile:', error)
        }
      } else {
        setProfile(null)
      }
      setIsLoading(state.isLoading)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await blink.auth.signInWithEmail(email, password)
    } catch (error: any) {
      toast.error(error.message || 'Échec de la connexion')
      throw error
    }
  }

  const signUp = async (params: any) => {
    try {
      await blink.auth.signUp(params)
    } catch (error: any) {
      toast.error(error.message || 'Échec de l\'inscription')
      throw error
    }
  }

  const logout = async () => {
    await blink.auth.signOut()
    navigate('/')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
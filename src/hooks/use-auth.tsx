import { createContext, useContext, useEffect, useState } from 'react'
import { blink } from '@/lib/blink'
import type { BlinkUser } from '@blinkdotnew/sdk'

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
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<BlinkUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      setUser(state.user)
      setIsLoading(state.isLoading)

      if (state.user) {
        try {
          // Fetch or create profile in our DB
          const users = await blink.db.users.list({
            where: { id: state.user.id }
          }) as UserProfile[]

          if (users.length > 0) {
            setProfile(users[0])
          } else {
            // Create initial profile
            const newProfile = await blink.db.users.create({
              id: state.user.id,
              userId: state.user.id,
              email: state.user.email,
              role: 'client',
              displayName: state.user.displayName || null,
              phone: null,
            }) as UserProfile
            setProfile(newProfile)
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
        }
      } else {
        setProfile(null)
      }
    })

    return unsubscribe
  }, [])

  const login = () => blink.auth.login()
  const logout = () => blink.auth.logout()

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: !!user,
        login,
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

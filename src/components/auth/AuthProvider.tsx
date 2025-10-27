'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { AuthService, AuthUser } from '@/lib/auth'
import { withTimeout } from '@/lib/timeout'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // タイムアウト付きで初期セッション取得
    withTimeout(
      AuthService.getCurrentUser(),
      4000,
      'getCurrentUser'
    )
      .then((user) => {
        setUser(user)
        setLoading(false)
      })
      .catch((e) => {
        console.warn('[AuthProvider] getCurrentUser timeout/failed', e)
        setUser(null)
        setLoading(false)
      })

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async () => {
    try {
      await AuthService.signInWithGoogle()
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  const signOut = async () => {
    try {
      await AuthService.signOut()
      setUser(null)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
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

import { supabase } from './supabase'

export interface AuthUser {
  id: string
  email: string
  name: string
}

export class AuthService {
  static async signInWithGoogle() {
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '/auth/callback'
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo
      }
    })
    
    if (error) {
      throw new Error(error.message)
    }
    
    return data
  }
  
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw new Error(error.message)
    }
  }
  
  static async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }
    
    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.full_name || user.email || ''
    }
  }
  
  static async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      throw new Error(error.message)
    }
    
    return session
  }
  
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser()
        callback(user)
      } else {
        callback(null)
      }
    })
  }
}


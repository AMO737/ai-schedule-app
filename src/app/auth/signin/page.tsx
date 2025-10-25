'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function SignInPage() {
  useEffect(() => {
    const signInWithGoogle = async () => {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        })

        if (error) {
          console.error('Error signing in:', error)
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    signInWithGoogle()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 connotext-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Googleでログインしています...</p>
      </div>
    </div>
  )
}

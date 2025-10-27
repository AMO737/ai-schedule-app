'use client'

import { useAuth } from './AuthProvider'
import { Button } from '@/components/ui/button'

export function LoginButton() {
  const { signIn, loading } = useAuth()

  return (
    <Button 
      onClick={signIn} 
      disabled={loading}
      className="w-full"
    >
      {loading ? 'ログイン中...' : 'Googleでログイン'}
    </Button>
  )
}




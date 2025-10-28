'use client'

import { Button } from '@/components/ui/button'
import { AuthService } from '@/lib/auth'

export function LoginButton() {
  const onClick = async () => {
    try {
      await AuthService.signInWithGoogle()
    } catch (e) {
      console.error('Login failed', e)
    }
  }

  return (
    <Button onClick={onClick}>
      Googleでログイン
    </Button>
  )
}
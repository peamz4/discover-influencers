'use client'

import { useAuthInit } from '@/lib/hooks/use-auth-init'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isInitialized } = useAuthInit()

  // Show nothing while initializing to prevent flash of wrong content
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#0a0a1f] via-[#1a1a3e] to-[#2d1b4e]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#00d9ff] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-gray-300">Initializing...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

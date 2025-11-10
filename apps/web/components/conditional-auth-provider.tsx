'use client'

import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/components/auth-provider'

interface ConditionalAuthProviderProps {
  children: React.ReactNode
}

// Pages that don't need auth initialization
const PUBLIC_ROUTES = ['/', '/login', '/register']

export function ConditionalAuthProvider({ children }: ConditionalAuthProviderProps) {
  const pathname = usePathname()
  
  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
  
  // For public routes, skip AuthProvider to prevent unnecessary API calls
  if (isPublicRoute) {
    return <>{children}</>
  }
  
  // For protected routes, use AuthProvider to verify session
  return <AuthProvider>{children}</AuthProvider>
}

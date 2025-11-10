'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, user, hasRole } = useAuthStore()
  const [isChecking, setIsChecking] = React.useState(true)

  React.useEffect(() => {
    // Give a small delay to allow auth initialization to complete
    const checkAuth = () => {
      // Check authentication
      if (!isAuthenticated) {
        router.push('/login')
        return
      }

      // Check role authorization if roles are specified
      if (allowedRoles && allowedRoles.length > 0) {
        const hasPermission = hasRole(allowedRoles)
        if (!hasPermission) {
          // Redirect non-admin users to discovery page instead of dashboard
          router.push('/discover')
          return
        }
      }

      setIsChecking(false)
    }

    // Small delay to allow AuthProvider to initialize
    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [isAuthenticated, user, allowedRoles, router, hasRole])

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#0a0a1f] via-[#1a1a3e] to-[#2d1b4e]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00d9ff] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

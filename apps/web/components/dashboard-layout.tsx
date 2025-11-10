'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Users, 
  UserCircle, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X,
  Settings,
  Database
} from 'lucide-react'

import { useAuthStore } from '@/lib/store/auth'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Master Table', href: '/dashboard/mastertable', icon: Database },
  { name: 'Influencers', href: '/dashboard/influencers', icon: Users },
  { name: 'Users', href: '/dashboard/users', icon: UserCircle, roles: ['ADMIN'] },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, clearAuth, hasRole } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  const filteredNavigation = navigation.filter(item => {
    if (!item.roles) return true
    return hasRole(item.roles)
  })

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0a1f] via-[#1a1a3e] to-[#2d1b4e]">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div
          className="fixed inset-0 bg-black/75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-[#0a0a1f] border-r border-[#00d9ff]/20">
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-xl font-bold gradient-text">PRIME MEDIA</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-[#00d9ff] transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-linear-to-r from-[#00d9ff]/20 to-[#4169e1]/20 text-[#00d9ff] border border-[#00d9ff]/30'
                      : 'text-gray-300 hover:bg-[#1a1a3e]/50 hover:text-white border border-transparent'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 shrink-0 ${
                      isActive ? 'text-[#00d9ff]' : 'text-gray-400 group-hover:text-[#00d9ff]'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-56 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-[#00d9ff]/20 bg-[#0a0a1f]/95 backdrop-blur-sm">
          <div className="flex h-12 items-center px-4">
            <h1 className="text-lg font-bold gradient-text">PRIME MEDIA</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-3">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-linear-to-r from-[#00d9ff]/20 to-[#4169e1]/20 text-[#00d9ff] border border-[#00d9ff]/30 shadow-lg shadow-[#00d9ff]/20'
                      : 'text-gray-300 hover:bg-[#1a1a3e]/50 hover:text-white border border-transparent'
                  }`}
                >
                  <item.icon
                    className={`mr-2 h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#00d9ff]' : 'text-gray-400 group-hover:text-[#00d9ff]'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-[#00d9ff]/20 p-3">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className="h-8 w-8 rounded-full bg-linear-to-br from-[#00d9ff] to-[#4169e1] flex items-center justify-center">
                  <UserCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-2 flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-[#00d9ff]">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 text-gray-400 hover:text-[#ff00ff] transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-56">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex h-12 shrink-0 border-b border-[#00d9ff]/20 bg-[#0a0a1f]/95 backdrop-blur-sm lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="border-r border-[#00d9ff]/20 px-3 text-gray-300 hover:text-[#00d9ff] transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#00d9ff]"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex flex-1 justify-between px-3">
            <div className="flex flex-1 items-center">
              <h1 className="text-base font-semibold gradient-text">PRIME MEDIA</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-[#ff00ff] transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-4">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

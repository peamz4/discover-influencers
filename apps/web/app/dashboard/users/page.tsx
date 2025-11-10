'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/protected-route'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { userService, type User } from '@/lib/services/user.service'
import { Search, UserPlus, Edit, Trash2, Shield, Users as UsersIcon, Mail, Calendar } from 'lucide-react'

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalUsers, setTotalUsers] = React.useState(0)
  const pageSize = 12

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true)
      const data = await userService.getUsers({
        page: currentPage,
        limit: pageSize,
        search: search || undefined,
        role: roleFilter || undefined,
      })

      setUsers(data.users)
      setTotalPages(data.pagination.totalPages)
      setTotalUsers(data.pagination.total)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, search, roleFilter])

  React.useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [search, roleFilter])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      await userService.deleteUser(id)
      fetchUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('Failed to delete user')
    }
  }

  const handleClearFilters = () => {
    setSearch('')
    setRoleFilter('')
    setCurrentPage(1)
  }

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      ADMIN: 'bg-[#ff00ff]/20 text-[#ff00ff] border-[#ff00ff]/30',
      EDITOR: 'bg-[#4169e1]/20 text-[#4169e1] border-[#4169e1]/30',
      VIEWER: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    }
    return colors[role as keyof typeof colors] || colors.VIEWER
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight gradient-text">Users Management</h1>
              <p className="mt-1 text-sm text-gray-400">
                Manage user accounts and permissions
              </p>
            </div>
            <Button
              onClick={() => router.push('/dashboard/users/new')}
              className="bg-linear-to-r from-[#00d9ff] to-[#4169e1] hover:from-[#00b8db] hover:to-[#3557c7] text-white font-semibold"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          {/* Filters */}
          <Card className="glass border-[#00d9ff]/20">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-md bg-[#1a1a3e]/50 border border-[#00d9ff]/30 text-white px-4 py-2 min-w-[150px]"
                >
                  <option value="">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="EDITOR">Editor</option>
                  <option value="VIEWER">Viewer</option>
                </select>

                {/* Clear Filters */}
                {(search || roleFilter) && (
                  <Button
                    onClick={handleClearFilters}
                    variant="outline"
                    className="border-[#ff00ff]/30 text-[#ff00ff] hover:bg-[#ff00ff]/10"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              Showing {users.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0} - {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers} users
            </span>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00d9ff] border-t-transparent"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && users.length === 0 && (
            <Card className="glass border-[#00d9ff]/20">
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <UsersIcon className="h-12 w-12 text-gray-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No users found</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    {search || roleFilter ? 'Try adjusting your filters' : 'Get started by adding your first user'}
                  </p>
                  {!search && !roleFilter && (
                    <Button
                      onClick={() => router.push('/dashboard/users/new')}
                      className="bg-linear-to-r from-[#00d9ff] to-[#4169e1] hover:from-[#00b8db] hover:to-[#3557c7] text-white font-semibold"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add First User
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users Grid */}
          {!loading && users.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Card key={user.id} className="glass border-[#00d9ff]/20 hover:border-[#00d9ff]/40 transition-all">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* User Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white truncate">{user.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        </div>
                      </div>

                      {/* Role Badge */}
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#00d9ff]" />
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t border-[#00d9ff]/10">
                        <Button
                          onClick={() => router.push(`/dashboard/users/${user.id}/edit`)}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-[#4169e1]/30 text-[#4169e1] hover:bg-[#4169e1]/10"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(user.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                variant="outline"
                className="border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                className="border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

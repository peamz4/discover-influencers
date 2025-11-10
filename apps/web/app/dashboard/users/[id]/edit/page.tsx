'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ProtectedRoute } from '@/components/protected-route'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { userService } from '@/lib/services/user.service'
import { ArrowLeft, Save, Shield } from 'lucide-react'

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']),
})

type UserFormData = z.infer<typeof userSchema>

export default function UserFormPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const isEdit = id && id !== 'new'

  const [loading, setLoading] = React.useState(false)
  const [initialLoading, setInitialLoading] = React.useState(isEdit)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: 'VIEWER',
    },
  })

  React.useEffect(() => {
    const fetchUser = async () => {
      if (!isEdit) return

      try {
        const data = await userService.getUser(id)
        reset({
          name: data.name,
          email: data.email,
          role: data.role,
          password: '',
        })
      } catch (error) {
        console.error('Failed to fetch user:', error)
        alert('Failed to load user')
      } finally {
        setInitialLoading(false)
      }
    }

    fetchUser()
  }, [id, isEdit, reset])

  const onSubmit = async (data: UserFormData) => {
    try {
      setLoading(true)

      if (isEdit) {
        const updateData: {
          name: string;
          email: string;
          role: 'ADMIN' | 'EDITOR' | 'VIEWER';
          password?: string;
        } = {
          name: data.name,
          email: data.email,
          role: data.role,
        }
        if (data.password) {
          updateData.password = data.password
        }
        await userService.updateUser(id, updateData)
      } else {
        if (!data.password) {
          alert('Password is required for new users')
          return
        }
        await userService.createUser({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        })
      }

      router.push('/dashboard/users')
    } catch (error) {
      console.error('Failed to save user:', error)
      alert('Failed to save user')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00d9ff] border-t-transparent"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push('/dashboard/users')}
              variant="outline"
              className="border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight gradient-text">
                {isEdit ? 'Edit User' : 'New User'}
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                {isEdit ? 'Update user information and permissions' : 'Add a new user to your system'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="max-w-2xl space-y-6">
              {/* Basic Info */}
              <Card className="glass border-[#00d9ff]/20">
                <CardHeader>
                  <CardTitle className="text-white">User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-200">Name *</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white mt-2"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-200">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white mt-2"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-gray-200">
                      Password {isEdit ? '(leave blank to keep current)' : '*'}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      {...register('password')}
                      className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white mt-2"
                      placeholder={isEdit ? 'Enter new password to change' : 'Enter password'}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Role & Permissions */}
              <Card className="glass border-[#ff00ff]/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#ff00ff]" />
                    <CardTitle className="text-white">Role & Permissions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="role" className="text-gray-200">User Role *</Label>
                    <select
                      id="role"
                      {...register('role')}
                      className="w-full rounded-md bg-[#1a1a3e]/50 border border-[#ff00ff]/30 text-white px-3 py-2 mt-2"
                    >
                      <option value="VIEWER">Viewer - Read-only access</option>
                      <option value="EDITOR">Editor - Can create and edit content</option>
                      <option value="ADMIN">Admin - Full system access</option>
                    </select>
                    {errors.role && (
                      <p className="text-sm text-red-400 mt-1">{errors.role.message}</p>
                    )}
                  </div>

                  <div className="rounded-md bg-[#1a1a3e]/30 border border-[#ff00ff]/20 p-4">
                    <h4 className="text-sm font-semibold text-gray-200 mb-2">Role Permissions</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-gray-500">•</span>
                        <span><strong className="text-gray-300">Viewer:</strong> Can view influencers and dashboard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-500">•</span>
                        <span><strong className="text-gray-300">Editor:</strong> Can create, edit, and delete influencers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-500">•</span>
                        <span><strong className="text-gray-300">Admin:</strong> Full access including user management</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="glass border-[#00d9ff]/20">
                <CardContent className="pt-6 flex gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-linear-to-r from-[#00d9ff] to-[#4169e1] hover:from-[#00b8db] hover:to-[#3557c7] text-white font-semibold"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard/users')}
                    className="border-[#ff00ff]/30 text-[#ff00ff] hover:bg-[#ff00ff]/10"
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

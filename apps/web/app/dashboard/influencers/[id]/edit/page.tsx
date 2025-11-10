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
import { influencerService } from '@/lib/services/influencer.service'
import { ArrowLeft, Save } from 'lucide-react'

const influencerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  city: z.string().optional(),
  country: z.string().optional(),
  followers: z.number().min(0, 'Followers must be positive'),
  engagementRate: z.number().min(0).max(100).optional(),
  // Align with backend enums LOW | MEDIUM | HIGH
  engagementTier: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  platform: z.string().optional(),
  collaborationStatus: z.enum(['PROSPECT', 'CONTACTED', 'WARM_LEAD', 'ACTIVE', 'PAUSED']),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']),
  notes: z.string().optional(),
})

type InfluencerFormData = z.infer<typeof influencerSchema>

export default function InfluencerFormPage() {
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
  } = useForm<InfluencerFormData>({
    resolver: zodResolver(influencerSchema),
    defaultValues: {
      collaborationStatus: 'PROSPECT',
      status: 'ACTIVE',
      followers: 0,
    },
  })

  React.useEffect(() => {
    const fetchInfluencer = async () => {
      if (!isEdit) return

      try {
        const data = await influencerService.getById(id)
        reset({
          name: data.name,
          email: data.email || '',
          phone: data.phone || '',
          category: data.category,
          city: data.city || '',
          country: data.country || '',
          followers: data.followers || 0,
          engagementRate: data.engagementRate || 0,
          engagementTier: data.engagementTier,
          platform: data.platform || '',
          collaborationStatus: data.collaborationStatus,
          status: data.status,
          notes: data.notes || '',
        })
      } catch (error) {
        console.error('Failed to fetch influencer:', error)
        alert('Failed to load influencer')
      } finally {
        setInitialLoading(false)
      }
    }

    fetchInfluencer()
  }, [id, isEdit, reset])

  const onSubmit = async (data: InfluencerFormData) => {
    try {
      setLoading(true)

      if (isEdit) {
        await influencerService.update(id, data)
      } else {
        await influencerService.create(data)
      }

      router.push('/dashboard/influencers')
    } catch (error) {
      console.error('Failed to save influencer:', error)
      alert('Failed to save influencer')
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
              onClick={() => router.push('/dashboard/influencers')}
              variant="outline"
              className="border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight gradient-text">
                {isEdit ? 'Edit Influencer' : 'New Influencer'}
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                {isEdit ? 'Update influencer information' : 'Add a new influencer to your database'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="glass border-[#00d9ff]/20">
                  <CardHeader>
                    <CardTitle className="text-white">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-200">Name *</Label>
                        <Input
                          id="name"
                          {...register('name')}
                          className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white"
                          placeholder="John Doe"
                        />
                        {errors.name && (
                          <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-gray-200">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email')}
                          className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white"
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-gray-200">Phone</Label>
                        <Input
                          id="phone"
                          {...register('phone')}
                          className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white"
                          placeholder="+1 234 567 8900"
                        />
                      </div>

                      <div>
                        <Label htmlFor="category" className="text-gray-200">Category *</Label>
                        <select
                          id="category"
                          {...register('category')}
                          className="w-full rounded-md bg-[#1a1a3e]/50 border border-[#00d9ff]/30 text-white px-3 py-2"
                        >
                          <option value="">Select category</option>
                          <option value="Lifestyle">Lifestyle</option>
                          <option value="Technology">Technology</option>
                          <option value="Food">Food</option>
                          <option value="Fashion">Fashion</option>
                          <option value="Gaming">Gaming</option>
                          <option value="Travel">Travel</option>
                          <option value="Beauty">Beauty</option>
                          <option value="Fitness">Fitness</option>
                        </select>
                        {errors.category && (
                          <p className="text-sm text-red-400 mt-1">{errors.category.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="city" className="text-gray-200">City</Label>
                        <Input
                          id="city"
                          {...register('city')}
                          className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white"
                          placeholder="Bangkok"
                        />
                      </div>

                      <div>
                        <Label htmlFor="country" className="text-gray-200">Country</Label>
                        <Input
                          id="country"
                          {...register('country')}
                          className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white"
                          placeholder="Thailand"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social & Metrics */}
                <Card className="glass border-[#4169e1]/20">
                  <CardHeader>
                    <CardTitle className="text-white">Social Media & Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="platform" className="text-gray-200">Instagram Handle</Label>
                        <Input
                          id="platform"
                          {...register('platform')}
                          className="bg-[#1a1a3e]/50 border-[#4169e1]/30 text-white"
                          placeholder="@username"
                        />
                      </div>

                      <div>
                        <Label htmlFor="followers" className="text-gray-200">Followers *</Label>
                        <Input
                          id="followers"
                          type="number"
                          {...register('followers', { valueAsNumber: true })}
                          className="bg-[#1a1a3e]/50 border-[#4169e1]/30 text-white"
                          placeholder="10000"
                        />
                        {errors.followers && (
                          <p className="text-sm text-red-400 mt-1">{errors.followers.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="engagementRate" className="text-gray-200">Engagement Rate (%)</Label>
                        <Input
                          id="engagementRate"
                          type="number"
                          step="0.01"
                          {...register('engagementRate', { valueAsNumber: true })}
                          className="bg-[#1a1a3e]/50 border-[#4169e1]/30 text-white"
                          placeholder="4.5"
                        />
                        {errors.engagementRate && (
                          <p className="text-sm text-red-400 mt-1">{errors.engagementRate.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="engagementTier" className="text-gray-200">Engagement Tier</Label>
                        <select
                          id="engagementTier"
                          {...register('engagementTier')}
                          className="w-full rounded-md bg-[#1a1a3e]/50 border border-[#4169e1]/30 text-white px-3 py-2"
                        >
                          <option value="">Select tier</option>
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card className="glass border-[#ff00ff]/20">
                  <CardHeader>
                    <CardTitle className="text-white">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="notes" className="text-gray-200">Internal Notes</Label>
                    <textarea
                      id="notes"
                      {...register('notes')}
                      rows={4}
                      className="w-full rounded-md bg-[#1a1a3e]/50 border border-[#ff00ff]/30 text-white px-3 py-2 mt-2"
                      placeholder="Add any notes about this influencer..."
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Status & Actions */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="glass border-[#00d9ff]/20">
                  <CardHeader>
                    <CardTitle className="text-white">Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="collaborationStatus" className="text-gray-200">Collaboration Status *</Label>
                      <select
                        id="collaborationStatus"
                        {...register('collaborationStatus')}
                        className="w-full rounded-md bg-[#1a1a3e]/50 border border-[#00d9ff]/30 text-white px-3 py-2 mt-2"
                      >
                        <option value="PROSPECT">Prospect</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="WARM_LEAD">Warm Lead</option>
                        <option value="ACTIVE">Active</option>
                        <option value="PAUSED">Paused</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="status" className="text-gray-200">Account Status *</Label>
                      <select
                        id="status"
                        {...register('status')}
                        className="w-full rounded-md bg-[#1a1a3e]/50 border border-[#00d9ff]/30 text-white px-3 py-2 mt-2"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="PENDING">Pending</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-[#00d9ff]/20">
                  <CardContent className="pt-6 space-y-3">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-linear-to-r from-[#00d9ff] to-[#4169e1] hover:from-[#00b8db] hover:to-[#3557c7] text-white font-semibold"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Saving...' : isEdit ? 'Update Influencer' : 'Create Influencer'}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/dashboard/influencers')}
                      className="w-full border-[#ff00ff]/30 text-[#ff00ff] hover:bg-[#ff00ff]/10"
                    >
                      Cancel
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

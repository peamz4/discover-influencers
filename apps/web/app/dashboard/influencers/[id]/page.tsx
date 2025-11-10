'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ProtectedRoute } from '@/components/protected-route'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { influencerService, type Influencer } from '@/lib/services/influencer.service'
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Instagram, TrendingUp, Users, RefreshCw } from 'lucide-react'

export default function InfluencerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [influencer, setInfluencer] = React.useState<Influencer | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [syncing, setSyncing] = React.useState(false)
  const [syncMessage, setSyncMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchInfluencer = async () => {
      try {
        const data = await influencerService.getById(id)
        setInfluencer(data)
      } catch (error) {
        console.error('Failed to fetch influencer:', error)
        alert('Failed to load influencer')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchInfluencer()
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this influencer?')) return

    try {
      await influencerService.delete(id)
      router.push('/dashboard/influencers')
    } catch (error) {
      console.error('Failed to delete influencer:', error)
      alert('Failed to delete influencer')
    }
  }

  const handleSyncMetrics = async () => {
    if (!confirm('Sync latest metrics from external sources? This may take a few seconds.')) return

    try {
      setSyncing(true)
      setSyncMessage(null)
      const updated = await influencerService.syncMetrics(id)
      setInfluencer(updated)
      
      if (updated.syncInfo) {
        const followerChange = updated.syncInfo.followerChange >= 0 
          ? `+${updated.syncInfo.followerChange.toLocaleString()}` 
          : updated.syncInfo.followerChange.toLocaleString()
        const rateChange = updated.syncInfo.engagementRateChange >= 0
          ? `+${(updated.syncInfo.engagementRateChange * 100).toFixed(2)}%`
          : `${(updated.syncInfo.engagementRateChange * 100).toFixed(2)}%`
        
        setSyncMessage(`Metrics updated! Followers: ${followerChange}, Engagement: ${rateChange}`)
        setTimeout(() => setSyncMessage(null), 5000)
      }
    } catch (error) {
      console.error('Failed to sync metrics:', error)
      alert('Failed to sync metrics. Please try again.')
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
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

  if (!influencer) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="text-center py-12">
            <p className="text-gray-400">Influencer not found</p>
            <Button onClick={() => router.push('/dashboard/influencers')} className="mt-4">
              Back to List
            </Button>
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
          <div className="flex items-center justify-between">
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
                  {influencer.name}
                </h1>
                <p className="mt-1 text-sm text-gray-400">Influencer Profile</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSyncMetrics}
                disabled={syncing}
                variant="outline"
                className="border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/10"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Metrics'}
              </Button>
              <Button
                onClick={() => router.push(`/dashboard/influencers/${id}/edit`)}
                className="bg-linear-to-r from-[#4169e1] to-[#00d9ff] hover:from-[#3557c7] hover:to-[#00b8db] text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                className="border-[#ff00ff]/30 text-[#ff00ff] hover:bg-[#ff00ff]/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Sync Message */}
          {syncMessage && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-green-400">
              <p className="text-sm">{syncMessage}</p>
            </div>
          )}

          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="glass border-[#00d9ff]/20 md:col-span-1">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="h-5 w-5 text-[#00d9ff]" />
                  <span className="text-sm">{influencer.email || 'No email'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="h-5 w-5 text-[#00d9ff]" />
                  <span className="text-sm">{influencer.phone || 'No phone'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="h-5 w-5 text-[#00d9ff]" />
                  <span className="text-sm">{influencer.city || 'No location'}</span>
                </div>
                {influencer.platform && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Instagram className="h-5 w-5 text-[#00d9ff]" />
                    <a
                      href={`https://instagram.com/${influencer.platform}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#00d9ff] hover:underline"
                    >
                      @{influencer.platform}
                    </a>
                  </div>
                )}

                <div className="pt-4 border-t border-[#00d9ff]/20">
                  <p className="text-sm text-gray-400 mb-2">Category</p>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#00d9ff]/20 text-[#00d9ff] text-sm">
                    {influencer.category}
                  </span>
                </div>

                <div className="pt-4 border-t border-[#00d9ff]/20">
                  <p className="text-sm text-gray-400 mb-2">Collaboration Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    influencer.collaborationStatus === 'PROSPECT' ? 'bg-yellow-500/20 text-yellow-400' :
                    influencer.collaborationStatus === 'CONTACTED' ? 'bg-blue-500/20 text-blue-400' :
                    influencer.collaborationStatus === 'WARM_LEAD' ? 'bg-orange-500/20 text-orange-400' :
                    influencer.collaborationStatus === 'ACTIVE' ? 'bg-green-500/20 text-green-400' :
                    influencer.collaborationStatus === 'PAUSED' ? 'bg-gray-500/20 text-gray-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {influencer.collaborationStatus?.replace(/_/g, ' ') || 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass border-[#4169e1]/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-200">
                    Total Followers
                  </CardTitle>
                  <Users className="h-4 w-4 text-[#4169e1]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {influencer.followers?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Tier: {influencer.engagementTier || 'N/A'}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass border-[#ff00ff]/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-200">
                    Engagement Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-[#ff00ff]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {typeof influencer.engagementRate === 'number' ? `${(influencer.engagementRate * 100).toFixed(1)}%` : 'N/A'}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Average engagement across posts
                  </p>
                </CardContent>
              </Card>

              <Card className="glass border-[#00d9ff]/20 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {influencer.notes || 'No notes available'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Metadata */}
          <Card className="glass border-[#00d9ff]/20">
            <CardHeader>
              <CardTitle className="text-white">Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="text-white font-medium">{influencer.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Created At</p>
                  <p className="text-white font-medium">
                    {new Date(influencer.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Last Updated</p>
                  <p className="text-white font-medium">
                    {new Date(influencer.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                {influencer.createdBy && (
                  <div>
                    <p className="text-sm text-gray-400">Created By</p>
                    <p className="text-white font-medium">{influencer.createdBy.name}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

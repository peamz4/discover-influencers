'use client'

import * as React from 'react'
import { ProtectedRoute } from '@/components/protected-route'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCircle, TrendingUp, Activity, Tag, Sparkles, BarChart3, Handshake } from 'lucide-react'
import { influencerService, type InfluencerStats, type Influencer } from '@/lib/services/influencer.service'
import { userService } from '@/lib/services/user.service'

export default function DashboardPage() {
  const [stats, setStats] = React.useState<InfluencerStats | null>(null)
  const [totalUsers, setTotalUsers] = React.useState(0)
  const [categoryBreakdown, setCategoryBreakdown] = React.useState<Array<{ category: string; count: number }>>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [statsData, usersData, influencersData] = await Promise.all([
          influencerService.getStats(),
          userService.getUsers({ page: 1, limit: 1 }),
          influencerService.getAll({ page: 1, limit: 1000 }), // Get all to calculate categories
        ])

        setStats(statsData)
        setTotalUsers(usersData.pagination.total)

        // Calculate category breakdown
        const categories = influencersData.data.reduce((acc: Record<string, number>, inf: Influencer) => {
          const cat = inf.category || 'Uncategorized'
          acc[cat] = (acc[cat] || 0) + 1
          return acc
        }, {})

        const categoryArray = Object.entries(categories)
          .map(([category, count]) => ({ category, count: count as number }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5) // Top 5 categories

        setCategoryBreakdown(categoryArray)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight gradient-text">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-300">
              Welcome to PRIME MEDIA Discovery Platform
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="glass border-[#00d9ff]/20 hover:border-[#00d9ff]/40 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">
                  Total Influencers
                </CardTitle>
                <Users className="h-4 w-4 text-[#00d9ff]" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-8 w-16 animate-pulse bg-[#1a1a3e] rounded"></div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-white">{stats?.totalInfluencers || 0}</div>
                    <p className="text-xs text-gray-400">
                      Active: {stats?.activeInfluencers || 0}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="glass border-[#4169e1]/20 hover:border-[#4169e1]/40 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">
                  Platform Users
                </CardTitle>
                <UserCircle className="h-4 w-4 text-[#4169e1]" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-8 w-16 animate-pulse bg-[#1a1a3e] rounded"></div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-white">{totalUsers}</div>
                    <p className="text-xs text-gray-400">
                      Registered users
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="glass border-[#ff00ff]/20 hover:border-[#ff00ff]/40 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">
                  Avg Engagement Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-[#ff00ff]" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-8 w-16 animate-pulse bg-[#1a1a3e] rounded"></div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-white">
                      {stats?.avgEngagementRate ? `${stats.avgEngagementRate.toFixed(1)}%` : 'N/A'}
                    </div>
                    <p className="text-xs text-gray-400">
                      Across all influencers
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="glass border-[#00d9ff]/20 hover:border-[#00d9ff]/40 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">
                  Total Followers
                </CardTitle>
                <Activity className="h-4 w-4 text-[#00d9ff]" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-8 w-16 animate-pulse bg-[#1a1a3e] rounded"></div>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-white">
                      {stats?.totalFollowers ? formatNumber(stats.totalFollowers) : '0'}
                    </div>
                    <p className="text-xs text-gray-400">
                      Combined reach
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          {!loading && categoryBreakdown.length > 0 && (
            <Card className="glass border-[#00d9ff]/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-[#00d9ff]" />
                  <CardTitle className="text-white">Top Categories</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Influencer distribution by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryBreakdown.map((item, index) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          index === 0 ? 'bg-[#00d9ff]/20 text-[#00d9ff]' :
                          index === 1 ? 'bg-[#4169e1]/20 text-[#4169e1]' :
                          index === 2 ? 'bg-[#ff00ff]/20 text-[#ff00ff]' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-white font-medium">{item.category}</span>
                      </div>
                      <span className="text-gray-400">{item.count} influencers</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="glass border-[#00d9ff]/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-400">
                  Common tasks to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="rounded-lg border border-[#00d9ff]/20 bg-[#1a1a3e]/30 p-3 hover:bg-[#1a1a3e]/50 hover:border-[#00d9ff]/40 cursor-pointer transition-all duration-300 group">
                  <p className="font-medium text-white group-hover:text-[#00d9ff] transition-colors">Add New Influencer</p>
                  <p className="text-sm text-gray-400">
                    Create a new influencer profile
                  </p>
                </div>
                <div className="rounded-lg border border-[#4169e1]/20 bg-[#1a1a3e]/30 p-3 hover:bg-[#1a1a3e]/50 hover:border-[#4169e1]/40 cursor-pointer transition-all duration-300 group">
                  <p className="font-medium text-white group-hover:text-[#4169e1] transition-colors">View All Influencers</p>
                  <p className="text-sm text-gray-400">
                    Browse and filter influencer list
                  </p>
                </div>
                <div className="rounded-lg border border-[#ff00ff]/20 bg-[#1a1a3e]/30 p-3 hover:bg-[#1a1a3e]/50 hover:border-[#ff00ff]/40 cursor-pointer transition-all duration-300 group">
                  <p className="font-medium text-white group-hover:text-[#ff00ff] transition-colors">Manage Users</p>
                  <p className="text-sm text-gray-400">
                    Add or edit platform users (Admin only)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-[#ff00ff]/20">
              <CardHeader>
                <CardTitle className="text-white">Platform Features</CardTitle>
                <CardDescription className="text-gray-400">
                  Explore powerful capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="rounded-lg border border-[#00d9ff]/30 bg-linear-to-r from-[#00d9ff]/10 to-transparent p-3">
                  <p className="font-medium text-[#00d9ff] flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI-Powered Matching
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    Discover influencers that align with your brand using advanced algorithms
                  </p>
                </div>
                <div className="rounded-lg border border-[#4169e1]/30 bg-linear-to-r from-[#4169e1]/10 to-transparent p-3">
                  <p className="font-medium text-[#4169e1] flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Real-time Analytics
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    Track engagement rates, reach, and campaign performance metrics
                  </p>
                </div>
                <div className="rounded-lg border border-[#ff00ff]/30 bg-linear-to-r from-[#ff00ff]/10 to-transparent p-3">
                  <p className="font-medium text-[#ff00ff] flex items-center gap-2">
                    <Handshake className="w-4 h-4" />
                    Collaboration Tools
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    Manage campaigns and communicate with influencers seamlessly
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

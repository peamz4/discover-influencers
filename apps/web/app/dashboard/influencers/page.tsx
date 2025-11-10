'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/protected-route'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { influencerService, type Influencer, type InfluencerFilters } from '@/lib/services/influencer.service'
import { categoryService, type Category } from '@/lib/services/category.service'
import { Search, Plus, Edit, Trash2, Eye, Filter } from 'lucide-react'

export default function InfluencersPage() {
  const router = useRouter()
  const [influencers, setInfluencers] = React.useState<Influencer[]>([])
  const [loading, setLoading] = React.useState(true)
  const [pagination, setPagination] = React.useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const [filters, setFilters] = React.useState<InfluencerFilters>({
    page: 1,
    limit: 10,
    search: '',
    category: '',
    city: '',
    engagementTier: '',
    collaborationStatus: '',
    minFollowers: undefined,
    maxFollowers: undefined,
    minEngagementRate: undefined,
    maxEngagementRate: undefined,
    sortBy: 'createdAt',
    order: 'desc',
  })

  const [showFilters, setShowFilters] = React.useState(false)
  const [categories, setCategories] = React.useState<Category[]>([])

  const fetchInfluencers = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await influencerService.getAll(filters)
      setInfluencers(response.data)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Failed to fetch influencers:', error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  React.useEffect(() => {
    fetchInfluencers()
  }, [fetchInfluencers])

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoryService.getAll()
        setCategories(cats)
      } catch {
        console.warn('Failed to load categories, using fallback list')
        setCategories([
          { id: 'fallback-1', name: 'Lifestyle', description: 'Fallback', createdAt: '', updatedAt: '' },
          { id: 'fallback-2', name: 'Technology', description: 'Fallback', createdAt: '', updatedAt: '' },
          { id: 'fallback-3', name: 'Food & Travel', description: 'Fallback', createdAt: '', updatedAt: '' },
        ])
      }
    }
    loadCategories()
  }, [])

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }))
  }

  const handleFilterChange = (key: keyof InfluencerFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this influencer?')) return
    
    try {
      await influencerService.delete(id)
      fetchInfluencers()
    } catch (error) {
      console.error('Failed to delete influencer:', error)
      alert('Failed to delete influencer')
    }
  }

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: '',
      category: '',
      city: '',
      engagementTier: '',
      collaborationStatus: '',
      minFollowers: undefined,
      maxFollowers: undefined,
      minEngagementRate: undefined,
      maxEngagementRate: undefined,
      sortBy: 'createdAt',
      order: 'desc',
    })
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight gradient-text">
                Influencers
              </h1>
              <p className="mt-2 text-sm text-gray-300">
                Manage your influencer database
              </p>
            </div>
            <Button
              onClick={() => router.push('/dashboard/influencers/new')}
              className="bg-linear-to-r from-[#00d9ff] to-[#4169e1] hover:from-[#00b8db] hover:to-[#3557c7] text-white font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Influencer
            </Button>
          </div>

          {/* Search and Filters */}
          <Card className="glass border-[#00d9ff]/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, email, or city..."
                      value={filters.search}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-10 bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white"
                    />
                  </div>
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    className="border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/10"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-[#00d9ff]/20">
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Category</label>
                      <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="w-full rounded-md bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white px-3 py-2"
                      >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">City</label>
                      <Input
                        placeholder="Filter by city"
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                        className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Engagement Tier</label>
                      <select
                        value={filters.engagementTier}
                        onChange={(e) => handleFilterChange('engagementTier', e.target.value)}
                        className="w-full rounded-md bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white px-3 py-2"
                      >
                        <option value="">All Tiers</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Collaboration Status</label>
                      <select
                        value={filters.collaborationStatus}
                        onChange={(e) => handleFilterChange('collaborationStatus', e.target.value)}
                        className="w-full rounded-md bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white px-3 py-2"
                      >
                        <option value="">All Collaboration Status</option>
                        <option value="PROSPECT">Prospect</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="WARM_LEAD">Warm Lead</option>
                        <option value="ACTIVE">Active</option>
                        <option value="PAUSED">Paused</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Min Followers</label>
                      <Input
                        type="number"
                        placeholder="e.g., 10000"
                        value={filters.minFollowers || ''}
                        onChange={(e) => handleFilterChange('minFollowers', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Max Followers</label>
                      <Input
                        type="number"
                        placeholder="e.g., 100000"
                        value={filters.maxFollowers || ''}
                        onChange={(e) => handleFilterChange('maxFollowers', e.target.value ? parseInt(e.target.value) : undefined)}
                        className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Min Engagement (%)</label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 3.0"
                        value={filters.minEngagementRate !== undefined ? (filters.minEngagementRate * 100).toFixed(1) : ''}
                        onChange={(e) => handleFilterChange('minEngagementRate', e.target.value ? parseFloat(e.target.value) / 100 : undefined)}
                        className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Max Engagement (%)</label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 10.0"
                        value={filters.maxEngagementRate !== undefined ? (filters.maxEngagementRate * 100).toFixed(1) : ''}
                        onChange={(e) => handleFilterChange('maxEngagementRate', e.target.value ? parseFloat(e.target.value) / 100 : undefined)}
                        className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white"
                      />
                    </div>

                    <div className="md:col-span-4 flex justify-end">
                      <Button
                        onClick={clearFilters}
                        variant="outline"
                        className="border-[#ff00ff]/30 text-[#ff00ff] hover:bg-[#ff00ff]/10"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="glass border-[#00d9ff]/20">
            <CardHeader>
              <CardTitle className="text-white">
                {pagination.total} Influencer{pagination.total !== 1 ? 's' : ''}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Page {pagination.page} of {pagination.totalPages}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00d9ff] border-t-transparent"></div>
                </div>
              ) : influencers.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No influencers found. Try adjusting your filters.
                </div>
              ) : (
                <div className="space-y-3">
                  {influencers.map((influencer) => (
                    <div
                      key={influencer.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-[#00d9ff]/20 bg-[#1a1a3e]/30 hover:bg-[#1a1a3e]/50 transition-all"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <p className="font-medium text-white">{influencer.name}</p>
                          <p className="text-sm text-gray-400">{influencer.email || 'No email'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Category</p>
                          <p className="text-[#00d9ff]">{influencer.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Followers</p>
                          <p className="text-white">{influencer.followers?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Engagement</p>
                          <p className="text-white">{typeof influencer.engagementRate === 'number' ? `${(influencer.engagementRate * 100).toFixed(1)}%` : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Collaboration</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
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
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/dashboard/influencers/${influencer.id}`)}
                          className="border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/dashboard/influencers/${influencer.id}/edit`)}
                          className="border-[#4169e1]/30 text-[#4169e1] hover:bg-[#4169e1]/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(influencer.id)}
                          className="border-[#ff00ff]/30 text-[#ff00ff] hover:bg-[#ff00ff]/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && influencers.length > 0 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#00d9ff]/20">
                  <p className="text-sm text-gray-400">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page! - 1 }))}
                      disabled={pagination.page === 1}
                      variant="outline"
                      size="sm"
                      className="border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/10 disabled:opacity-50"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setFilters(prev => ({ ...prev, page: prev.page! + 1 }))}
                      disabled={pagination.page >= pagination.totalPages}
                      variant="outline"
                      size="sm"
                      className="border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/10 disabled:opacity-50"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Filter, Users, TrendingUp, MapPin, X, UserCircle, LogOut } from 'lucide-react'
import { influencerService, Influencer, InfluencerFilters } from '@/lib/services/influencer.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/store/auth'
import { ProtectedRoute } from '@/components/protected-route'

interface Category {
  id: string
  name: string
  slug: string
  description: string
}

// Category service (for public access)
const categoryService = {
  async getAll(): Promise<Category[]> {
    // Fallback for public discovery page
    return [
      { id: '1', name: 'Lifestyle', slug: 'lifestyle', description: '' },
      { id: '2', name: 'Technology', slug: 'technology', description: '' },
      { id: '3', name: 'Food', slug: 'food', description: '' },
      { id: '4', name: 'Fashion', slug: 'fashion', description: '' },
      { id: '5', name: 'Gaming', slug: 'gaming', description: '' },
      { id: '6', name: 'Beauty', slug: 'beauty', description: '' },
      { id: '7', name: 'Travel', slug: 'travel', description: '' },
      { id: '8', name: 'Fitness', slug: 'fitness', description: '' },
    ]
  }
}

export default function DiscoverPage() {
  const router = useRouter()
  const { user, isAuthenticated, clearAuth } = useAuthStore()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [influencers, setInfluencers] = React.useState<Influencer[]>([])
  const [categories, setCategories] = React.useState<Category[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [showFilters, setShowFilters] = React.useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  const [totalCount, setTotalCount] = React.useState(0)
  
  // Filters
  const [filters, setFilters] = React.useState<InfluencerFilters>({
    page: 1,
    limit: 12,
    status: 'ACTIVE', // Only show active influencers to public
  })

  // Load categories
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoryService.getAll()
        setCategories(cats)
      } catch (error) {
        console.error('Failed to load categories:', error)
        // Fallback categories
        setCategories([
          { id: '1', name: 'Lifestyle', slug: 'lifestyle', description: '' },
          { id: '2', name: 'Technology', slug: 'technology', description: '' },
          { id: '3', name: 'Food', slug: 'food', description: '' },
          { id: '4', name: 'Fashion', slug: 'fashion', description: '' },
          { id: '5', name: 'Gaming', slug: 'gaming', description: '' },
        ])
      }
    }
    loadCategories()
  }, [])

  // Scroll effect for navbar
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch influencers
  const fetchInfluencers = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await influencerService.getAll(filters)
      setInfluencers(response.data)
      setCurrentPage(response.pagination.page)
      setTotalPages(response.pagination.totalPages)
      setTotalCount(response.pagination.total)
    } catch (error) {
      console.error('Failed to fetch influencers:', error)
      setInfluencers([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  React.useEffect(() => {
    fetchInfluencers()
  }, [fetchInfluencers])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }))
  }

  const handleFilterChange = (key: keyof InfluencerFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined, page: 1 }))
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({
      page: 1,
      limit: 12,
      status: 'ACTIVE',
    })
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const getEngagementBadgeColor = (tier?: string) => {
    switch (tier) {
      case 'HIGH': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'LOW': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  const handleDashboardClick = () => {
    if (user?.role === 'ADMIN') {
      router.push('/dashboard')
    } else {
      router.push('/discover')
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-[#0a0a1f] via-[#1a1a3e] to-[#2d1b4e]">
        {/* Navigation */}
        <nav className={`sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-gray-800/50 backdrop-blur-xl transition-all duration-300 ${
          isScrolled ? 'bg-[#0a0a1f]/30' : 'bg-[#0a0a1f]/80'
        }`}>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-r from-[#00d9ff] to-[#4169e1] rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
          </div>
          <span className="text-lg font-bold bg-linear-to-r from-[#00d9ff] to-[#4169e1] bg-clip-text text-transparent">
            PRIME
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {user.role === 'ADMIN' && (
                <button
                  onClick={handleDashboardClick}
                  className="text-gray-300 hover:text-[#00d9ff] transition-colors"
                >
                  Dashboard
                </button>
              )}
              <div className="flex items-center gap-3 px-4 py-2 bg-[#1a1a3e]/60 border border-[#00d9ff]/30 rounded-full">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-linear-to-br from-[#00d9ff] to-[#4169e1] flex items-center justify-center">
                    <UserCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{user.name}</span>
                    <span className="text-xs text-[#00d9ff]">{user.role}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-[#ff00ff] transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-300 hover:text-[#00d9ff] transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 text-sm bg-linear-to-r from-[#00d9ff] to-[#4169e1] text-white rounded-full hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative px-6 py-8 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-3">
              <span className="bg-linear-to-r from-white via-[#00d9ff] to-[#4169e1] bg-clip-text text-transparent">
                Discover Influencers
              </span>
            </h1>
            <p className="text-base text-gray-400 max-w-2xl mx-auto">
              Browse {totalCount} top influencers across multiple categories. Find the perfect match for your brand.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by name, category, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-32 h-11 text-sm bg-[#1a1a3e]/60 border-gray-700 text-white placeholder:text-gray-500 rounded-full"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                <Button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-gray-700 bg-[#1a1a3e]/60 hover:bg-[#1a1a3e] text-white text-xs"
                >
                  <Filter className="w-3 h-3 mr-1" />
                  Filters
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-full text-xs bg-linear-to-r from-[#00d9ff] to-[#4169e1] hover:shadow-lg hover:shadow-cyan-500/50"
                >
                  Search
                </Button>
              </div>
            </div>
          </form>

          {/* Filter Panel */}
          {showFilters && (
            <div className="max-w-3xl mx-auto mt-4 p-4 bg-[#1a1a3e]/60 backdrop-blur-xl border border-gray-700 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-white">Advanced Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-2 bg-[#0a0a1f] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00d9ff]"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                  <Input
                    type="text"
                    value={filters.city || ''}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    placeholder="e.g., Bangkok"
                    className="bg-[#0a0a1f] border-gray-700 text-white"
                  />
                </div>

                {/* Engagement Tier Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Engagement</label>
                  <select
                    value={filters.engagementTier || ''}
                    onChange={(e) => handleFilterChange('engagementTier', e.target.value)}
                    className="w-full px-4 py-2 bg-[#0a0a1f] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#00d9ff]"
                  >
                    <option value="">All Levels</option>
                    <option value="HIGH">High Engagement</option>
                    <option value="MEDIUM">Medium Engagement</option>
                    <option value="LOW">Low Engagement</option>
                  </select>
                </div>

                {/* Min Followers */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Min Followers</label>
                  <Input
                    type="number"
                    value={filters.minFollowers || ''}
                    onChange={(e) => handleFilterChange('minFollowers', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="e.g., 10000"
                    className="bg-[#0a0a1f] border-gray-700 text-white"
                  />
                </div>

                {/* Max Followers */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Max Followers</label>
                  <Input
                    type="number"
                    value={filters.maxFollowers || ''}
                    onChange={(e) => handleFilterChange('maxFollowers', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="e.g., 1000000"
                    className="bg-[#0a0a1f] border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Influencers Grid */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#00d9ff] border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading influencers...</p>
            </div>
          </div>
        ) : influencers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400">No influencers found</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters</p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="mt-4 border-gray-700 text-white hover:bg-gray-800"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {influencers.map((influencer) => (
                <Card
                  key={influencer.id}
                  className="bg-[#1a1a3e]/60 backdrop-blur-xl border-gray-700 hover:border-[#00d9ff]/50 transition-all group overflow-hidden"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-white truncate">
                          {influencer.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-[#00d9ff]/20 text-[#00d9ff] border border-[#00d9ff]/30">
                            {influencer.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Location */}
                    {influencer.city && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{influencer.city}{influencer.country && `, ${influencer.country}`}</span>
                      </div>
                    )}

                    {/* Platform */}
                    {influencer.platform && (
                      <div className="text-sm text-gray-400">
                        <span className="font-medium">Platform:</span> {influencer.platform}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="pt-3 border-t border-gray-700">
                      <div className="grid grid-cols-2 gap-3">
                        {/* Followers */}
                        <div>
                          <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                            <Users className="w-3 h-3" />
                            Followers
                          </div>
                          <div className="text-lg font-bold text-white">
                            {formatFollowers(influencer.followers)}
                          </div>
                        </div>

                        {/* Engagement */}
                        {influencer.engagementRate !== undefined && (
                          <div>
                            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                              <TrendingUp className="w-3 h-3" />
                              Engagement
                            </div>
                            <div className="text-lg font-bold text-white">
                              {(influencer.engagementRate * 100).toFixed(1)}%
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Engagement Tier Badge */}
                      {influencer.engagementTier && (
                        <div className="mt-3">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getEngagementBadgeColor(influencer.engagementTier)}`}>
                            {influencer.engagementTier} Engagement
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Contact Button */}
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-400">
                        Contact: {influencer.email || 'Not available'}
                      </p>
                      {influencer.phone && (
                        <p className="text-sm text-gray-400 mt-1">
                          Phone: {influencer.phone}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="border-gray-700 bg-[#1a1a3e]/60 text-white disabled:opacity-50"
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        className={currentPage === pageNum 
                          ? "bg-linear-to-r from-[#00d9ff] to-[#4169e1]"
                          : "border-gray-700 bg-[#1a1a3e]/60 text-white"
                        }
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="border-gray-700 bg-[#1a1a3e]/60 text-white disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            )}

            {/* Results Info */}
            <p className="text-center text-gray-400 mt-6">
              Showing {((currentPage - 1) * (filters.limit || 12)) + 1} to {Math.min(currentPage * (filters.limit || 12), totalCount)} of {totalCount} influencers
            </p>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-[#0a0a1f]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-linear-to-r from-[#00d9ff] to-[#4169e1] rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold bg-linear-to-r from-[#00d9ff] to-[#4169e1] bg-clip-text text-transparent">
                  PRIME MEDIA
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4 max-w-md">
                Your premier platform for discovering and collaborating with Thailand&apos;s most engaging content creators across all social media platforms.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-[#00d9ff] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#00d9ff] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#00d9ff] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#00d9ff] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-[#00d9ff] transition-colors text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/discover" className="text-gray-400 hover:text-[#00d9ff] transition-colors text-sm">
                    Discover
                  </Link>
                </li>
                {user?.role === 'ADMIN' && (
                  <li>
                    <Link href="/dashboard" className="text-gray-400 hover:text-[#00d9ff] transition-colors text-sm">
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-gray-400 hover:text-[#00d9ff] transition-colors text-sm"
                  >
                    Back to Top
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400 text-sm">
                  Email: info@primemedia.com
                </li>
                <li className="text-gray-400 text-sm">
                  Phone: +66 123 456 789
                </li>
                <li className="text-gray-400 text-sm">
                  Bangkok, Thailand
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-gray-800/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} PRIME MEDIA. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-[#00d9ff] transition-colors text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-[#00d9ff] transition-colors text-sm">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-[#00d9ff] transition-colors text-sm">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </ProtectedRoute>
  )
}

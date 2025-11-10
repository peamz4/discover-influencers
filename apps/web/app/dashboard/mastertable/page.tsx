'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/protected-route'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { peopleService, type Person, type PeopleFilters } from '@/lib/services/people.service'
import { categoryService, type Category } from '@/lib/services/category.service'
import { Search, Plus, Edit, Trash2, Eye, Filter, Users, UserCircle } from 'lucide-react'

export default function MasterTablePage() {
  const router = useRouter()
  const [people, setPeople] = React.useState<Person[]>([])
  const [loading, setLoading] = React.useState(true)
  const [pagination, setPagination] = React.useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const [filters, setFilters] = React.useState<PeopleFilters>({
    page: 1,
    limit: 10,
    search: '',
    recordType: '',
    category: '',
    city: '',
    gender: '',
    status: '',
    sortBy: 'createdAt',
    order: 'desc',
  })

  const [showFilters, setShowFilters] = React.useState(false)
  const [categories, setCategories] = React.useState<Category[]>([])

  const fetchPeople = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await peopleService.getAll(filters)
      setPeople(response.data)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Failed to fetch people:', error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  React.useEffect(() => {
    fetchPeople()
  }, [fetchPeople])

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoryService.getAll()
        setCategories(cats)
      } catch {
        console.warn('Failed to load categories')
      }
    }
    loadCategories()
  }, [])

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }))
  }

  const handleFilterChange = (key: keyof PeopleFilters, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  const handleDelete = async (id: string, name: string, recordType: string) => {
    if (!confirm(`Are you sure you want to delete ${name} (${recordType})?`)) return
    
    try {
      await peopleService.delete(id)
      fetchPeople()
    } catch (error) {
      console.error('Failed to delete person:', error)
      alert('Failed to delete person')
    }
  }

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: '',
      recordType: '',
      category: '',
      city: '',
      gender: '',
      status: '',
      sortBy: 'createdAt',
      order: 'desc',
    })
  }

  const getRecordTypeIcon = (type: string) => {
    return type === 'INFLUENCER' ? <Users className="h-4 w-4" /> : <UserCircle className="h-4 w-4" />
  }

  const getRecordTypeBadge = (type: string) => {
    return type === 'INFLUENCER' 
      ? 'bg-purple-500/20 text-purple-400'
      : 'bg-blue-500/20 text-blue-400'
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight gradient-text">
                Master Table
              </h1>
              <p className="mt-2 text-sm text-gray-300">
                All records - Individuals and Influencers
              </p>
            </div>
            <Button
              onClick={() => router.push('/dashboard/mastertable/new')}
              className="bg-linear-to-r from-[#00d9ff] to-[#4169e1] hover:from-[#00b8db] hover:to-[#3557c7] text-white font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Record
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
                      placeholder="Search by name, email, city, or occupation..."
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
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-[#00d9ff]/20">
                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Record Type</label>
                      <select
                        value={filters.recordType}
                        onChange={(e) => handleFilterChange('recordType', e.target.value)}
                        className="w-full rounded-md bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white px-3 py-2"
                      >
                        <option value="">All Types</option>
                        <option value="INDIVIDUAL">Individual</option>
                        <option value="INFLUENCER">Influencer</option>
                      </select>
                    </div>

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
                      <label className="text-sm text-gray-300 mb-2 block">Gender</label>
                      <select
                        value={filters.gender}
                        onChange={(e) => handleFilterChange('gender', e.target.value)}
                        className="w-full rounded-md bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white px-3 py-2"
                      >
                        <option value="">All Genders</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-300 mb-2 block">Status</label>
                      <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full rounded-md bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white px-3 py-2"
                      >
                        <option value="">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="PENDING">Pending</option>
                      </select>
                    </div>

                    <div className="md:col-span-5 flex justify-end">
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
                {pagination.total} Record{pagination.total !== 1 ? 's' : ''}
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
              ) : people.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No records found. Try adjusting your filters.
                </div>
              ) : (
                <div className="space-y-3">
                  {people.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-[#00d9ff]/20 bg-[#1a1a3e]/30 hover:bg-[#1a1a3e]/50 transition-all"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getRecordTypeIcon(person.recordType)}
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getRecordTypeBadge(person.recordType)}`}>
                              {person.recordType}
                            </span>
                          </div>
                          <p className="font-medium text-white">{person.fullName}</p>
                          <p className="text-sm text-gray-400">{person.email || 'No email'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">
                            {person.recordType === 'INFLUENCER' ? 'Category' : 'Occupation'}
                          </p>
                          <p className="text-[#00d9ff]">
                            {person.recordType === 'INFLUENCER' 
                              ? person.influencerCategory || 'N/A'
                              : person.occupation || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Location</p>
                          <p className="text-white">{person.city || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Gender</p>
                          <p className="text-white">
                            {person.gender === 'M' ? 'Male' : person.gender === 'F' ? 'Female' : person.gender === 'OTHER' ? 'Other' : 'N/A'}
                          </p>
                        </div>
                        {person.recordType === 'INFLUENCER' && (
                          <div>
                            <p className="text-sm text-gray-400">Followers</p>
                            <p className="text-white">{person.followersCount?.toLocaleString() || '0'}</p>
                          </div>
                        )}
                        {person.recordType === 'INDIVIDUAL' && (
                          <div>
                            <p className="text-sm text-gray-400">Interests</p>
                            <p className="text-white text-sm truncate">{person.interests || 'N/A'}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-400">Status</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            person.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' :
                            person.status === 'INACTIVE' ? 'bg-gray-500/20 text-gray-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {person.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/dashboard/mastertable/${person.id}`)}
                          className="border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/dashboard/mastertable/${person.id}/edit`)}
                          className="border-[#4169e1]/30 text-[#4169e1] hover:bg-[#4169e1]/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(person.id, person.fullName, person.recordType)}
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
              {!loading && people.length > 0 && (
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

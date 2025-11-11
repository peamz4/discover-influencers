'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/protected-route'
import DashboardLayout from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { peopleService } from '@/lib/services/people.service'
import { categoryService, type Category } from '@/lib/services/category.service'
import { ArrowLeft, Save, Users, UserCircle } from 'lucide-react'

export default function NewRecordPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [categories, setCategories] = React.useState<Category[]>([])
  const [recordType, setRecordType] = React.useState<'INDIVIDUAL' | 'INFLUENCER'>('INDIVIDUAL')

  const [formData, setFormData] = React.useState({
    recordType: 'INDIVIDUAL' as 'INDIVIDUAL' | 'INFLUENCER',
    fullName: '',
    preferredName: '',
    gender: '' as 'M' | 'F' | 'OTHER' | '',
    birthDate: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    occupation: '',
    influencerCategory: '',
    primaryPlatform: '',
    followersCount: '',
    engagementRate: '',
    engagementRateTier: '' as 'LOW' | 'MEDIUM' | 'HIGH' | '',
    interests: '',
    notes: '',
    secondaryPlatform: '',
    secondaryFollowersCount: '',
    averageMonthlyReach: '',
    collaborationStatus: '' as 'PROSPECT' | 'CONTACTED' | 'WARM_LEAD' | 'ACTIVE' | 'PAUSED' | '',
    languages: '',
    portfolioUrl: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'PENDING',
  })

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoryService.getAll()
        setCategories(cats)
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }
    loadCategories()
  }, [])

  React.useEffect(() => {
    setFormData(prev => ({ ...prev, recordType }))
  }, [recordType])

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.fullName.trim()) {
      alert('Full name is required')
      return
    }

    if (recordType === 'INFLUENCER' && !formData.influencerCategory) {
      alert('Category is required for influencers')
      return
    }

    try {
      setLoading(true)
      
      // Convert numeric fields
      const submitData: any = {
        ...formData,
        recordType,
      }

      // Convert numeric fields
      if (formData.followersCount) {
        submitData.followersCount = parseInt(formData.followersCount)
      }
      if (formData.secondaryFollowersCount) {
        submitData.secondaryFollowersCount = parseInt(formData.secondaryFollowersCount)
      }
      if (formData.averageMonthlyReach) {
        submitData.averageMonthlyReach = parseInt(formData.averageMonthlyReach)
      }
      if (formData.engagementRate) {
        submitData.engagementRate = parseFloat(formData.engagementRate)
      }

      // Remove empty strings
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === '') {
          delete submitData[key]
        }
      })

      await peopleService.create(submitData)
      router.push('/dashboard/mastertable')
    } catch (error) {
      console.error('Failed to create record:', error)
      alert('Failed to create record. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'EDITOR']}>
      <DashboardLayout>
        <div className="space-y-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="sm"
              className="border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight gradient-text">
                Add New Record
              </h1>
              <p className="mt-2 text-sm text-gray-300">
                Create a new individual or influencer record
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Record Type Selection */}
            <Card className="glass border-[#00d9ff]/20">
              <CardHeader>
                <CardTitle className="text-white">Record Type</CardTitle>
                <CardDescription className="text-gray-400">
                  Select whether this is an individual or an influencer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRecordType('INDIVIDUAL')}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      recordType === 'INDIVIDUAL'
                        ? 'border-[#00d9ff] bg-[#00d9ff]/10'
                        : 'border-[#00d9ff]/20 bg-[#1a1a3e]/30 hover:border-[#00d9ff]/40'
                    }`}
                  >
                    <UserCircle className={`h-8 w-8 mx-auto mb-2 ${
                      recordType === 'INDIVIDUAL' ? 'text-[#00d9ff]' : 'text-gray-400'
                    }`} />
                    <p className={`font-semibold ${
                      recordType === 'INDIVIDUAL' ? 'text-[#00d9ff]' : 'text-white'
                    }`}>Individual</p>
                    <p className="text-xs text-gray-400 mt-1">Regular person record</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecordType('INFLUENCER')}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      recordType === 'INFLUENCER'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-purple-500/20 bg-[#1a1a3e]/30 hover:border-purple-500/40'
                    }`}
                  >
                    <Users className={`h-8 w-8 mx-auto mb-2 ${
                      recordType === 'INFLUENCER' ? 'text-purple-400' : 'text-gray-400'
                    }`} />
                    <p className={`font-semibold ${
                      recordType === 'INFLUENCER' ? 'text-purple-400' : 'text-white'
                    }`}>Influencer</p>
                    <p className="text-xs text-gray-400 mt-1">Social media influencer</p>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className="glass border-[#00d9ff]/20">
              <CardHeader>
                <CardTitle className="text-white">Basic Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Essential personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName" className="text-white">
                      Full Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="preferredName" className="text-white">Preferred Name</Label>
                    <Input
                      id="preferredName"
                      value={formData.preferredName}
                      onChange={(e) => handleChange('preferredName', e.target.value)}
                      className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-white">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender" className="text-white">Gender</Label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full rounded-md bg-[#1a1a3e]/50 border border-[#00d9ff]/30 text-white px-3 py-2 mt-1"
                    >
                      <option value="">Select...</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="birthDate" className="text-white">Birth Date</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleChange('birthDate', e.target.value)}
                      className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-white">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="country" className="text-white">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="languages" className="text-white">Languages</Label>
                    <Input
                      id="languages"
                      value={formData.languages}
                      onChange={(e) => handleChange('languages', e.target.value)}
                      placeholder="e.g., English, Spanish"
                      className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-white">Status</Label>
                    <select
                      id="status"
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="w-full rounded-md bg-[#1a1a3e]/50 border border-[#00d9ff]/30 text-white px-3 py-2 mt-1"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="PENDING">Pending</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Type-Specific Fields */}
            {recordType === 'INDIVIDUAL' && (
              <Card className="glass border-[#00d9ff]/20">
                <CardHeader>
                  <CardTitle className="text-white">Individual Details</CardTitle>
                  <CardDescription className="text-gray-400">
                    Additional information for individual records
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="occupation" className="text-white">Occupation</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => handleChange('occupation', e.target.value)}
                      className="bg-[#1a1a3e]/50 border-[#00d9ff]/30 text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="interests" className="text-white">Interests</Label>
                    <textarea
                      id="interests"
                      value={formData.interests}
                      onChange={(e) => handleChange('interests', e.target.value)}
                      rows={3}
                      className="w-full rounded-md bg-[#1a1a3e]/50 border border-[#00d9ff]/30 text-white px-3 py-2 mt-1"
                      placeholder="Hobbies, interests, etc."
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {recordType === 'INFLUENCER' && (
              <>
                <Card className="glass border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">Influencer Details</CardTitle>
                    <CardDescription className="text-gray-400">
                      Social media and engagement information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="influencerCategory" className="text-white">
                          Category <span className="text-red-400">*</span>
                        </Label>
                        <select
                          id="influencerCategory"
                          value={formData.influencerCategory}
                          onChange={(e) => handleChange('influencerCategory', e.target.value)}
                          className="w-full rounded-md bg-[#1a1a3e]/50 border border-purple-500/30 text-white px-3 py-2 mt-1"
                          required={recordType === 'INFLUENCER'}
                        >
                          <option value="">Select category...</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="primaryPlatform" className="text-white">Primary Platform</Label>
                        <select
                          id="primaryPlatform"
                          value={formData.primaryPlatform}
                          onChange={(e) => handleChange('primaryPlatform', e.target.value)}
                          className="w-full rounded-md bg-[#1a1a3e]/50 border border-purple-500/30 text-white px-3 py-2 mt-1"
                        >
                          <option value="">Select platform...</option>
                          <option value="Instagram">Instagram</option>
                          <option value="TikTok">TikTok</option>
                          <option value="YouTube">YouTube</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Twitter">Twitter</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Twitch">Twitch</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="followersCount" className="text-white">Followers Count</Label>
                        <Input
                          id="followersCount"
                          type="number"
                          value={formData.followersCount}
                          onChange={(e) => handleChange('followersCount', e.target.value)}
                          className="bg-[#1a1a3e]/50 border-purple-500/30 text-white mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="engagementRate" className="text-white">Engagement Rate (%)</Label>
                        <Input
                          id="engagementRate"
                          type="number"
                          step="0.01"
                          value={formData.engagementRate}
                          onChange={(e) => handleChange('engagementRate', e.target.value)}
                          placeholder="e.g., 4.5"
                          className="bg-[#1a1a3e]/50 border-purple-500/30 text-white mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="engagementRateTier" className="text-white">Engagement Tier</Label>
                        <select
                          id="engagementRateTier"
                          value={formData.engagementRateTier}
                          onChange={(e) => handleChange('engagementRateTier', e.target.value)}
                          className="w-full rounded-md bg-[#1a1a3e]/50 border border-purple-500/30 text-white px-3 py-2 mt-1"
                        >
                          <option value="">Select tier...</option>
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="secondaryPlatform" className="text-white">Secondary Platform</Label>
                        <select
                          id="secondaryPlatform"
                          value={formData.secondaryPlatform}
                          onChange={(e) => handleChange('secondaryPlatform', e.target.value)}
                          className="w-full rounded-md bg-[#1a1a3e]/50 border border-purple-500/30 text-white px-3 py-2 mt-1"
                        >
                          <option value="">Select platform...</option>
                          <option value="Instagram">Instagram</option>
                          <option value="TikTok">TikTok</option>
                          <option value="YouTube">YouTube</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Twitter">Twitter</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Twitch">Twitch</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="secondaryFollowersCount" className="text-white">Secondary Followers</Label>
                        <Input
                          id="secondaryFollowersCount"
                          type="number"
                          value={formData.secondaryFollowersCount}
                          onChange={(e) => handleChange('secondaryFollowersCount', e.target.value)}
                          className="bg-[#1a1a3e]/50 border-purple-500/30 text-white mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="averageMonthlyReach" className="text-white">Avg Monthly Reach</Label>
                        <Input
                          id="averageMonthlyReach"
                          type="number"
                          value={formData.averageMonthlyReach}
                          onChange={(e) => handleChange('averageMonthlyReach', e.target.value)}
                          className="bg-[#1a1a3e]/50 border-purple-500/30 text-white mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="collaborationStatus" className="text-white">Collaboration Status</Label>
                        <select
                          id="collaborationStatus"
                          value={formData.collaborationStatus}
                          onChange={(e) => handleChange('collaborationStatus', e.target.value)}
                          className="w-full rounded-md bg-[#1a1a3e]/50 border border-purple-500/30 text-white px-3 py-2 mt-1"
                        >
                          <option value="">Select status...</option>
                          <option value="PROSPECT">Prospect</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="WARM_LEAD">Warm Lead</option>
                          <option value="ACTIVE">Active</option>
                          <option value="PAUSED">Paused</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="portfolioUrl" className="text-white">Portfolio URL</Label>
                        <Input
                          id="portfolioUrl"
                          type="url"
                          value={formData.portfolioUrl}
                          onChange={(e) => handleChange('portfolioUrl', e.target.value)}
                          placeholder="https://..."
                          className="bg-[#1a1a3e]/50 border-purple-500/30 text-white mt-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Notes */}
            <Card className="glass border-[#00d9ff]/20">
              <CardHeader>
                <CardTitle className="text-white">Additional Notes</CardTitle>
                <CardDescription className="text-gray-400">
                  Optional notes and comments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={4}
                  className="w-full rounded-md bg-[#1a1a3e]/50 border border-[#00d9ff]/30 text-white px-3 py-2"
                  placeholder="Any additional information..."
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#00d9ff] to-[#4169e1] hover:from-[#00b8db] hover:to-[#3557c7] text-white font-semibold"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Record
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={() => router.back()}
                variant="outline"
                className="border-[#00d9ff]/30 text-[#00d9ff] hover:bg-[#00d9ff]/10"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

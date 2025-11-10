import apiClient from '../api';

export interface Influencer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  category: string;
  city?: string;
  country?: string;
  followers: number;
  engagementRate?: number;
  // Align with backend: LOW | MEDIUM | HIGH
  engagementTier?: 'LOW' | 'MEDIUM' | 'HIGH';
  platform?: string;
  collaborationStatus?: 'PROSPECT' | 'CONTACTED' | 'WARM_LEAD' | 'ACTIVE' | 'PAUSED';
  notes?: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface InfluencerFilters {
  page?: number;
  limit?: number;
  category?: string;
  city?: string;
  engagementTier?: string;
  status?: string;
  collaborationStatus?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  // Future: numeric range filters
  minFollowers?: number;
  maxFollowers?: number;
  minEngagementRate?: number; // fraction, e.g. 0.05 for 5%
  maxEngagementRate?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InfluencerStats {
  totalInfluencers: number;
  activeInfluencers: number;
  totalFollowers: number;
  avgEngagementRate: number; // percentage
  byCategory?: { category: string; count: number }[];
  byTier?: { engagementRateTier: string; count: number }[];
  byStatus?: { status: string; count: number }[];
}

export interface SyncInfo {
  previousFollowers: number;
  followerChange: number;
  previousEngagementRate: number;
  engagementRateChange: number;
  syncedAt: string;
}

export const influencerService = {
  async getAll(filters?: InfluencerFilters): Promise<PaginatedResponse<Influencer>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    const response = await apiClient.get(`/api/influencers?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Influencer> {
    const response = await apiClient.get(`/api/influencers/${id}`);
    return response.data;
  },

  async create(data: Partial<Influencer>): Promise<Influencer> {
    const response = await apiClient.post('/api/influencers', data);
    return response.data;
  },

  async update(id: string, data: Partial<Influencer>): Promise<Influencer> {
    const response = await apiClient.put(`/api/influencers/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/influencers/${id}`);
  },

  async getStats(): Promise<InfluencerStats> {
    const response = await apiClient.get('/api/influencers/analytics/stats');
    return response.data;
  },

  async syncMetrics(id: string): Promise<Influencer & { syncInfo?: SyncInfo }> {
    const response = await apiClient.post(`/api/influencers/${id}/sync-metrics`);
    return response.data;
  },
};

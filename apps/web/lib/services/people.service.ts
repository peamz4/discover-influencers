import apiClient from '../api';

export interface Person {
  id: string;
  recordId: string;
  recordType: 'INDIVIDUAL' | 'INFLUENCER';
  fullName: string;
  preferredName?: string;
  gender?: 'M' | 'F' | 'OTHER';
  birthDate?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  occupation?: string;
  influencerCategory?: string;
  primaryPlatform?: string;
  followersCount?: number;
  totalFollowersCount?: number;
  engagementRate?: number;
  engagementRateTier?: 'LOW' | 'MEDIUM' | 'HIGH';
  interests?: string;
  notes?: string;
  secondaryPlatform?: string;
  secondaryFollowersCount?: number;
  averageMonthlyReach?: number;
  collaborationStatus?: 'PROSPECT' | 'CONTACTED' | 'WARM_LEAD' | 'ACTIVE' | 'PAUSED';
  languages?: string;
  portfolioUrl?: string;
  lastContactDate?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PeopleFilters {
  page?: number;
  limit?: number;
  recordType?: 'INDIVIDUAL' | 'INFLUENCER' | '';
  category?: string;
  city?: string;
  gender?: 'M' | 'F' | 'OTHER' | '';
  status?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
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

export const peopleService = {
  async getAll(filters?: PeopleFilters): Promise<PaginatedResponse<Person>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    const response = await apiClient.get(`/api/people?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Person> {
    const response = await apiClient.get(`/api/people/${id}`);
    return response.data;
  },

  async create(data: Partial<Person>): Promise<Person> {
    const response = await apiClient.post('/api/people', data);
    return response.data;
  },

  async update(id: string, data: Partial<Person>): Promise<Person> {
    const response = await apiClient.put(`/api/people/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/people/${id}`);
  },
};

import apiClient from '../api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'ADMIN' | 'EDITOR' | 'VIEWER';
  password?: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export const userService = {
  async getUsers(params: GetUsersParams = {}): Promise<UsersResponse> {
    const { page = 1, limit = 10, search, role } = params;
    const response = await apiClient.get('/api/users', { 
      params: { page, limit, search, role } 
    });
    return response.data;
  },

  async getUser(id: string): Promise<User> {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  },

  async createUser(data: CreateUserData): Promise<User> {
    const response = await apiClient.post('/api/users', data);
    return response.data;
  },

  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    const response = await apiClient.put(`/api/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/api/users/${id}`);
  },
};

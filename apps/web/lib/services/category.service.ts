import apiClient from '../api';

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const res = await apiClient.get('/api/categories');
    return res.data as Category[];
  },
};

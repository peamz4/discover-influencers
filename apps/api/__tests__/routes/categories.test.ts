import request from 'supertest';
import { createTestApp } from '../helpers/test-app';
import prisma from '../../src/lib/prisma';
import { createMockUser, createMockCategory, generateTestToken } from '../helpers/test-helpers';

// Create test app with full middleware
const app = createTestApp();

describe('Categories Routes', () => {
  describe('GET /api/categories', () => {
    it('should return all categories without authentication', async () => {
      const mockCategories = [
        createMockCategory({ id: '1', name: 'Fashion' }),
        createMockCategory({ id: '2', name: 'Technology' }),
        createMockCategory({ id: '3', name: 'Food' }),
      ];

      (prisma.category.findMany as jest.Mock).mockResolvedValue(mockCategories);

      const response = await request(app).get('/api/categories');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('description');
    });

    it('should return empty array when no categories exist', async () => {
      (prisma.category.findMany as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/api/categories');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/categories', () => {
    it('should allow ADMIN to create category', async () => {
      const mockAdmin = createMockUser({ role: 'ADMIN' });
      const newCategory = createMockCategory({ name: 'Sports' });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdmin);
      (prisma.category.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.category.create as jest.Mock).mockResolvedValue(newCategory);

      const token = generateTestToken(mockAdmin.id, 'ADMIN');
      const response = await request(app)
        .post('/api/categories')
        .set('Cookie', [`access_token=${token}`])
        .send({
          name: 'Sports',
          description: 'Sports and athletics influencers',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'Sports');
    });

    it('should return 403 for non-ADMIN users', async () => {
      const mockViewer = createMockUser({ role: 'VIEWER' });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockViewer);

      const token = generateTestToken(mockViewer.id, 'VIEWER');
      const response = await request(app)
        .post('/api/categories')
        .set('Cookie', [`access_token=${token}`])
        .send({
          name: 'Sports',
        });

      expect(response.status).toBe(403);
    });

    it('should return 400 for duplicate category name', async () => {
      const mockAdmin = createMockUser({ role: 'ADMIN' });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdmin);
      // Mock Prisma unique constraint violation
      (prisma.category.create as jest.Mock).mockRejectedValue({ code: 'P2002' });

      const token = generateTestToken(mockAdmin.id, 'ADMIN');
      const response = await request(app)
        .post('/api/categories')
        .set('Cookie', [`access_token=${token}`])
        .send({
          name: 'Fashion',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({
          name: 'Sports',
        });

      expect(response.status).toBe(401);
    });
  });
});

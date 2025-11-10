import request from 'supertest';
import { createTestApp } from '../helpers/test-app';
import prisma from '../../src/lib/prisma';
import { createMockUser, createMockInfluencer, generateTestToken } from '../helpers/test-helpers';

// Create test app with full middleware
const app = createTestApp();

describe('Influencers Routes', () => {
  describe('GET /api/influencers', () => {
    it('should return paginated list of influencers', async () => {
      const mockUser = createMockUser({ role: 'VIEWER' });
      const mockInfluencers = [
        createMockInfluencer({ id: '1', fullName: 'Influencer 1' }),
        createMockInfluencer({ id: '2', fullName: 'Influencer 2' }),
      ];

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.person.findMany as jest.Mock).mockResolvedValue(mockInfluencers);
      (prisma.person.count as jest.Mock).mockResolvedValue(2);

      const token = generateTestToken(mockUser.id, mockUser.role);
      const response = await request(app)
        .get('/api/influencers')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });

    it('should filter by category', async () => {
      const mockUser = createMockUser({ role: 'VIEWER' });
      const mockInfluencers = [
        createMockInfluencer({ influencerCategory: 'Fashion' }),
      ];

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.person.findMany as jest.Mock).mockResolvedValue(mockInfluencers);
      (prisma.person.count as jest.Mock).mockResolvedValue(1);

      const token = generateTestToken(mockUser.id);
      const response = await request(app)
        .get('/api/influencers?category=Fashion')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body.data[0].influencerCategory).toBe('Fashion');
    });

    it('should filter by engagement tier', async () => {
      const mockUser = createMockUser();
      const mockInfluencers = [
        createMockInfluencer({ engagementRateTier: 'HIGH' }),
      ];

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.person.findMany as jest.Mock).mockResolvedValue(mockInfluencers);
      (prisma.person.count as jest.Mock).mockResolvedValue(1);

      const token = generateTestToken(mockUser.id);
      const response = await request(app)
        .get('/api/influencers?engagementTier=HIGH')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body.data[0].engagementRateTier).toBe('HIGH');
    });

    it('should filter by follower range', async () => {
      const mockUser = createMockUser();
      const mockInfluencers = [
        createMockInfluencer({ followersCount: 150000 }),
      ];

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.person.findMany as jest.Mock).mockResolvedValue(mockInfluencers);
      (prisma.person.count as jest.Mock).mockResolvedValue(1);

      const token = generateTestToken(mockUser.id);
      const response = await request(app)
        .get('/api/influencers?minFollowers=100000&maxFollowers=200000')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(200);
    });

    it('should search by name', async () => {
      const mockUser = createMockUser();
      const mockInfluencers = [
        createMockInfluencer({ fullName: 'Emma Fashion' }),
      ];

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.person.findMany as jest.Mock).mockResolvedValue(mockInfluencers);
      (prisma.person.count as jest.Mock).mockResolvedValue(1);

      const token = generateTestToken(mockUser.id);
      const response = await request(app)
        .get('/api/influencers?search=Emma')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(200);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/influencers');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/influencers/:id', () => {
    it('should return single influencer by id', async () => {
      const mockUser = createMockUser();
      const mockInfluencer = createMockInfluencer();

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.person.findFirst as jest.Mock).mockResolvedValue(mockInfluencer);

      const token = generateTestToken(mockUser.id);
      const response = await request(app)
        .get(`/api/influencers/${mockInfluencer.id}`)
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', mockInfluencer.id);
      expect(response.body).toHaveProperty('fullName');
    });

    it('should return 404 for non-existent influencer', async () => {
      const mockUser = createMockUser();

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.person.findFirst as jest.Mock).mockResolvedValue(null);

      const token = generateTestToken(mockUser.id);
      const response = await request(app)
        .get('/api/influencers/nonexistent-id')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/influencers', () => {
    it('should create influencer with ADMIN role', async () => {
      const mockAdmin = createMockUser({ role: 'ADMIN' });
      const newInfluencer = createMockInfluencer({
        fullName: 'New Influencer',
        email: 'new@example.com',
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdmin);
      (prisma.person.create as jest.Mock).mockResolvedValue(newInfluencer);

      const token = generateTestToken(mockAdmin.id, 'ADMIN');
      const response = await request(app)
        .post('/api/influencers')
        .set('Cookie', [`access_token=${token}`])
        .send({
          name: 'New Influencer',
          email: 'new@example.com',
          category: 'Fashion',
          followers: 50000,
          engagementRate: 0.05,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name'); // Transformed from fullName
      expect(response.body).toHaveProperty('id');
    });

    it('should create influencer with EDITOR role', async () => {
      const mockEditor = createMockUser({ role: 'EDITOR' });
      const newInfluencer = createMockInfluencer();

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockEditor);
      (prisma.person.create as jest.Mock).mockResolvedValue(newInfluencer);

      const token = generateTestToken(mockEditor.id, 'EDITOR');
      const response = await request(app)
        .post('/api/influencers')
        .set('Cookie', [`access_token=${token}`])
        .send({
          name: 'New Influencer',
          category: 'Tech',
        });

      expect(response.status).toBe(201);
    });

    it('should return 403 for VIEWER role', async () => {
      const mockViewer = createMockUser({ role: 'VIEWER' });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockViewer);

      const token = generateTestToken(mockViewer.id, 'VIEWER');
      const response = await request(app)
        .post('/api/influencers')
        .set('Cookie', [`access_token=${token}`])
        .send({
          name: 'New Influencer',
          category: 'Fashion',
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for validation errors', async () => {
      const mockAdmin = createMockUser({ role: 'ADMIN' });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdmin);

      const token = generateTestToken(mockAdmin.id, 'ADMIN');
      const response = await request(app)
        .post('/api/influencers')
        .set('Cookie', [`access_token=${token}`])
        .send({
          // Missing required fields
          email: 'invalid-email',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/influencers/:id', () => {
    it('should update influencer with ADMIN role', async () => {
      const mockAdmin = createMockUser({ role: 'ADMIN' });
      const existingInfluencer = createMockInfluencer();
      const updatedInfluencer = { ...existingInfluencer, fullName: 'Updated Name' };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdmin);
      (prisma.person.findUnique as jest.Mock).mockResolvedValue(existingInfluencer);
      (prisma.person.update as jest.Mock).mockResolvedValue(updatedInfluencer);

      const token = generateTestToken(mockAdmin.id, 'ADMIN');
      const response = await request(app)
        .put(`/api/influencers/${existingInfluencer.id}`)
        .set('Cookie', [`access_token=${token}`])
        .send({
          name: 'Updated Name',
          followers: 200000,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Name'); // Transformed from fullName
    });

    it('should return 404 for non-existent influencer', async () => {
      const mockAdmin = createMockUser({ role: 'ADMIN' });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdmin);
      (prisma.person.findFirst as jest.Mock).mockResolvedValue(null);

      const token = generateTestToken(mockAdmin.id, 'ADMIN');
      const response = await request(app)
        .put('/api/influencers/nonexistent-id')
        .set('Cookie', [`access_token=${token}`])
        .send({
          name: 'Updated Name',
        });

      expect(response.status).toBe(404);
    });

    it('should return 403 for VIEWER role', async () => {
      const mockViewer = createMockUser({ role: 'VIEWER' });
      const existingInfluencer = createMockInfluencer();

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockViewer);

      const token = generateTestToken(mockViewer.id, 'VIEWER');
      const response = await request(app)
        .put(`/api/influencers/${existingInfluencer.id}`)
        .set('Cookie', [`access_token=${token}`])
        .send({
          name: 'Updated Name',
        });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/influencers/:id', () => {
    it('should delete influencer with ADMIN role', async () => {
      const mockAdmin = createMockUser({ role: 'ADMIN' });
      const existingInfluencer = createMockInfluencer();

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdmin);
      (prisma.person.findUnique as jest.Mock).mockResolvedValue(existingInfluencer);
      (prisma.person.delete as jest.Mock).mockResolvedValue(existingInfluencer);

      const token = generateTestToken(mockAdmin.id, 'ADMIN');
      const response = await request(app)
        .delete(`/api/influencers/${existingInfluencer.id}`)
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 403 for non-ADMIN role', async () => {
      const mockEditor = createMockUser({ role: 'EDITOR' });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockEditor);

      const token = generateTestToken(mockEditor.id, 'EDITOR');
      const response = await request(app)
        .delete('/api/influencers/some-id')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(403);
    });

    it('should return 404 for non-existent influencer', async () => {
      const mockAdmin = createMockUser({ role: 'ADMIN' });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdmin);
      (prisma.person.findFirst as jest.Mock).mockResolvedValue(null);

      const token = generateTestToken(mockAdmin.id, 'ADMIN');
      const response = await request(app)
        .delete('/api/influencers/nonexistent-id')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/influencers/:id/sync-metrics', () => {
    it('should sync metrics for influencer', async () => {
      const mockEditor = createMockUser({ role: 'EDITOR' });
      const existingInfluencer = createMockInfluencer({ followersCount: 100000 });
      const syncedInfluencer = { ...existingInfluencer, followersCount: 101000 };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockEditor);
      (prisma.person.findUnique as jest.Mock).mockResolvedValue(existingInfluencer);
      (prisma.person.update as jest.Mock).mockResolvedValue(syncedInfluencer);

      const token = generateTestToken(mockEditor.id, 'EDITOR');
      const response = await request(app)
        .post(`/api/influencers/${existingInfluencer.id}/sync-metrics`)
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('syncInfo');
    });

    it('should return 403 for VIEWER role', async () => {
      const mockViewer = createMockUser({ role: 'VIEWER' });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockViewer);

      const token = generateTestToken(mockViewer.id, 'VIEWER');
      const response = await request(app)
        .post('/api/influencers/some-id/sync-metrics')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/influencers/analytics/stats', () => {
    it('should return analytics statistics', async () => {
      const mockUser = createMockUser();

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.person.count as jest.Mock).mockResolvedValue(15);
      (prisma.person.aggregate as jest.Mock).mockResolvedValue({
        _sum: { followersCount: 1000000 },
        _avg: { engagementRate: 0.054 },
      });
      (prisma.person.groupBy as jest.Mock)
        .mockResolvedValueOnce([
          { influencerCategory: 'Fashion', _count: { _all: 5 } },
          { influencerCategory: 'Tech', _count: { _all: 3 } },
        ])
        .mockResolvedValueOnce([
          { engagementRateTier: 'HIGH', _count: { _all: 4 } },
          { engagementRateTier: 'MEDIUM', _count: { _all: 6 } },
        ])
        .mockResolvedValueOnce([
          { status: 'ACTIVE', _count: { _all: 14 } },
          { status: 'INACTIVE', _count: { _all: 1 } },
        ]);

      const token = generateTestToken(mockUser.id);
      const response = await request(app)
        .get('/api/influencers/analytics/stats')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalInfluencers');
      expect(response.body).toHaveProperty('byCategory');
      expect(response.body).toHaveProperty('byTier');
      expect(response.body).toHaveProperty('byStatus');
      expect(Array.isArray(response.body.byCategory)).toBe(true);
    });
  });
});

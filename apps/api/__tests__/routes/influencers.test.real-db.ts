import request from 'supertest';
import { createTestApp } from '../helpers/test-app';
import { createTestUser, createTestInfluencer } from '../helpers/test-data';

const app = createTestApp();

describe('Influencers Routes (Real DB)', () => {
  describe('GET /api/influencers', () => {
    it('should return paginated list of influencers', async () => {
      // Create user and influencers
      const user = await createTestUser({ email: 'influencer-list@example.com', role: 'VIEWER' });
      await createTestInfluencer(user.id, { fullName: 'Influencer 1' });
      await createTestInfluencer(user.id, { fullName: 'Influencer 2' });

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'influencer-list@example.com', password: 'password123' });

      const cookies = loginResponse.headers['set-cookie'] || [];

      // Get influencers
      const response = await request(app)
        .get('/api/influencers')
        .set('Cookie', cookies);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/influencers');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/influencers/:id', () => {
    it('should return single influencer by id', async () => {
      // Create user and influencer
      const user = await createTestUser({ email: 'inf-single@example.com' });
      const influencer = await createTestInfluencer(user.id, { 
        fullName: 'Single Influencer' 
      });

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'inf-single@example.com', password: 'password123' });

      const cookies = loginResponse.headers['set-cookie'] || [];

      // Get influencer
      const response = await request(app)
        .get(`/api/influencers/${influencer.id}`)
        .set('Cookie', cookies);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', influencer.id);
      expect(response.body).toHaveProperty('name'); // Transformed from fullName
    });
  });

  describe('POST /api/influencers', () => {
    it('should create influencer with ADMIN role', async () => {
      // Create admin
      await createTestUser({ email: 'admin-inf@example.com', role: 'ADMIN' });

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin-inf@example.com', password: 'password123' });

      const cookies = loginResponse.headers['set-cookie'] || [];

      // Create influencer
      const response = await request(app)
        .post('/api/influencers')
        .set('Cookie', cookies)
        .send({
          name: 'New Influencer',
          email: 'new-inf@example.com',
          category: 'Fashion',
          platform: 'Instagram',
          followers: 50000,
          engagementRate: 0.05,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'New Influencer');
      expect(response.body).toHaveProperty('id');
    });

    it('should return 403 for VIEWER role', async () => {
      // Create viewer
      await createTestUser({ email: 'viewer-inf@example.com', role: 'VIEWER' });

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'viewer-inf@example.com', password: 'password123' });

      const cookies = loginResponse.headers['set-cookie'] || [];

      // Try to create influencer
      const response = await request(app)
        .post('/api/influencers')
        .set('Cookie', cookies)
        .send({
          name: 'Test Influencer',
          email: 'test@example.com',
        });

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/influencers/:id', () => {
    it('should update influencer with ADMIN role', async () => {
      // Create admin and influencer
      const admin = await createTestUser({ email: 'admin-upd@example.com', role: 'ADMIN' });
      const influencer = await createTestInfluencer(admin.id, {
        fullName: 'Original Name',
      });

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin-upd@example.com', password: 'password123' });

      const cookies = loginResponse.headers['set-cookie'] || [];

      // Update influencer
      const response = await request(app)
        .put(`/api/influencers/${influencer.id}`)
        .set('Cookie', cookies)
        .send({
          name: 'Updated Name',
          followers: 100000,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Name');
    });
  });

  describe('DELETE /api/influencers/:id', () => {
    it('should delete influencer with ADMIN role', async () => {
      // Create admin and influencer
      const admin = await createTestUser({ email: 'admin-del@example.com', role: 'ADMIN' });
      const influencer = await createTestInfluencer(admin.id);

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin-del@example.com', password: 'password123' });

      const cookies = loginResponse.headers['set-cookie'] || [];

      // Delete influencer
      const response = await request(app)
        .delete(`/api/influencers/${influencer.id}`)
        .set('Cookie', cookies);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });
});

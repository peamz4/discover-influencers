import request from 'supertest';
import { createTestApp } from '../helpers/test-app';
import { createTestUser, createTestCategory } from '../helpers/test-data';

const app = createTestApp();

describe('Categories Routes (Real DB)', () => {
  describe('GET /api/categories', () => {
    it('should return all categories without authentication', async () => {
      // Create some categories
      await createTestCategory({ name: 'Fashion' });
      await createTestCategory({ name: 'Tech' });

      const response = await request(app).get('/api/categories');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('POST /api/categories', () => {
    it('should allow ADMIN to create category', async () => {
      // Create admin
      await createTestUser({ email: 'admin-cat@example.com', role: 'ADMIN' });

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin-cat@example.com', password: 'password123' });

      const cookies = loginResponse.headers['set-cookie'] || [];

      // Create category
      const response = await request(app)
        .post('/api/categories')
        .set('Cookie', cookies)
        .send({
          name: 'Sports',
          description: 'Sports and fitness influencers',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('name', 'Sports');
    });

    it('should return 403 for non-ADMIN users', async () => {
      // Create viewer
      await createTestUser({ email: 'viewer-cat@example.com', role: 'VIEWER' });

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'viewer-cat@example.com', password: 'password123' });

      const cookies = loginResponse.headers['set-cookie'] || [];

      // Try to create category
      const response = await request(app)
        .post('/api/categories')
        .set('Cookie', cookies)
        .send({ name: 'Gaming' });

      expect(response.status).toBe(403);
    });

    it('should return 400 for duplicate category name', async () => {
      // Create admin and category
      await createTestUser({ email: 'admin-dup@example.com', role: 'ADMIN' });
      await createTestCategory({ name: 'Beauty' });

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin-dup@example.com', password: 'password123' });

      const cookies = loginResponse.headers['set-cookie'] || [];

      // Try to create duplicate
      const response = await request(app)
        .post('/api/categories')
        .set('Cookie', cookies)
        .send({ name: 'Beauty' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});

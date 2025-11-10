import request from 'supertest';
import { createTestApp } from '../helpers/test-app';
import { createTestUser } from '../helpers/test-data';

const app = createTestApp();

describe('Users Routes (Real DB)', () => {
  describe('GET /api/users', () => {
    it('should return all users for ADMIN', async () => {
      // Create admin user
      const admin = await createTestUser({
        email: 'admin@example.com',
        role: 'ADMIN',
      });

      // Create some regular users
      await createTestUser({ email: 'user1@example.com', name: 'User 1' });
      await createTestUser({ email: 'user2@example.com', name: 'User 2' });

      // Login as admin
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@example.com', password: 'password123' });

      const cookies = loginResponse.headers['set-cookie'];

      // Get users
      const response = await request(app)
        .get('/api/users')
        .set('Cookie', cookies);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(3);
      expect(response.body.data[0]).not.toHaveProperty('password');
    });

    it('should return 403 for non-ADMIN users', async () => {
      // Create viewer user
      await createTestUser({ email: 'viewer@example.com', role: 'VIEWER' });

      // Login as viewer
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'viewer@example.com', password: 'password123' });

      const cookies = loginResponse.headers['set-cookie'];

      const response = await request(app)
        .get('/api/users')
        .set('Cookie', cookies);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/users', () => {
    it('should allow ADMIN to create user', async () => {
      // Create admin
      await createTestUser({ email: 'admin2@example.com', role: 'ADMIN' });

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin2@example.com', password: 'password123' });

      const cookies = loginResponse.headers['set-cookie'];

      // Create new user
      const response = await request(app)
        .post('/api/users')
        .set('Cookie', cookies)
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User',
          role: 'EDITOR',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('email', 'newuser@example.com');
      expect(response.body).toHaveProperty('role', 'EDITOR');
      expect(response.body).not.toHaveProperty('password');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should allow user to update own profile', async () => {
      // Create user
      const user = await createTestUser({ email: 'updateme@example.com', name: 'Old Name' });

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'updateme@example.com', password: 'password123' });

      const cookies = loginResponse.headers['set-cookie'] || [];

      // Update profile
      const response = await request(app)
        .put(`/api/users/${user.id}`)
        .set('Cookie', cookies)
        .send({ name: 'New Name' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'New Name');
    });

    it('should allow ADMIN to update any user', async () => {
      // Create admin and target user
      await createTestUser({ email: 'admin3@example.com', role: 'ADMIN' });
      const targetUser = await createTestUser({ email: 'target@example.com', role: 'VIEWER' });

      // Login as admin
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin3@example.com', password: 'password123' });

      const cookies = loginResponse.headers['set-cookie'] || [];

      // Update target user
      const response = await request(app)
        .put(`/api/users/${targetUser.id}`)
        .set('Cookie', cookies)
        .send({ role: 'EDITOR' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('role', 'EDITOR');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should allow ADMIN to delete users', async () => {
      // Create admin and target user
      await createTestUser({ email: 'admin4@example.com', role: 'ADMIN' });
      const targetUser = await createTestUser({ email: 'deleteme@example.com' });

      // Login as admin
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin4@example.com', password: 'password123' });

      const cookies = loginResponse.headers['set-cookie'];

      // Delete user
      const response = await request(app)
        .delete(`/api/users/${targetUser.id}`)
        .set('Cookie', cookies);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });
});

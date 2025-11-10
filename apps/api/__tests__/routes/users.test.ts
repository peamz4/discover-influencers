import request from 'supertest';
import { createTestApp } from '../helpers/test-app';
import prisma from '../../src/lib/prisma';
import { createMockUser, generateTestToken } from '../helpers/test-helpers';
import bcrypt from 'bcryptjs';

// Create test app with full middleware
const app = createTestApp();

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('Users Routes', () => {
  describe('GET /api/users', () => {
    it('should return all users for ADMIN', async () => {
      const mockAdmin = createMockUser({ role: 'ADMIN' });
      // Mock response without passwords (as per select clause)
      const mockUsers = [
        {
          id: '1',
          email: 'user1@example.com',
          name: 'User 1',
          role: 'VIEWER' as const,
          avatarUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          email: 'user2@example.com',
          name: 'User 2',
          role: 'EDITOR' as const,
          avatarUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdmin);
      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
      (prisma.user.count as jest.Mock).mockResolvedValue(2);

      const token = generateTestToken(mockAdmin.id, 'ADMIN');
      const response = await request(app)
        .get('/api/users')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).not.toHaveProperty('password');
    });

    it('should return 403 for non-ADMIN users', async () => {
      const mockViewer = createMockUser({ role: 'VIEWER' });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockViewer);

      const token = generateTestToken(mockViewer.id, 'VIEWER');
      const response = await request(app)
        .get('/api/users')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by id for ADMIN', async () => {
      const mockAdmin = createMockUser({ role: 'ADMIN' });
      // Mock response without password
      const targetUser = {
        id: 'target-id',
        email: 'target@example.com',
        name: 'Target User',
        role: 'VIEWER' as const,
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockAdmin)
        .mockResolvedValueOnce(targetUser);

      const token = generateTestToken(mockAdmin.id, 'ADMIN');
      const response = await request(app)
        .get('/api/users/target-id')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 'target-id');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user', async () => {
      const mockAdmin = createMockUser({ role: 'ADMIN' });

      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockAdmin)
        .mockResolvedValueOnce(null);

      const token = generateTestToken(mockAdmin.id, 'ADMIN');
      const response = await request(app)
        .get('/api/users/nonexistent-id')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(404);
    });

    it('should return 403 for non-ADMIN users', async () => {
      const mockEditor = createMockUser({ role: 'EDITOR' });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockEditor);

      const token = generateTestToken(mockEditor.id, 'EDITOR');
      const response = await request(app)
        .get('/api/users/some-id')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should allow ADMIN to update any user', async () => {
      const mockAdmin = createMockUser({ role: 'ADMIN' });
      const targetUser = createMockUser({ id: 'target-id', role: 'VIEWER' });
      const updatedUser = { ...targetUser, name: 'Updated Name', role: 'EDITOR' };

      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockAdmin)
        .mockResolvedValueOnce(targetUser);
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const token = generateTestToken(mockAdmin.id, 'ADMIN');
      const response = await request(app)
        .put('/api/users/target-id')
        .set('Cookie', [`access_token=${token}`])
        .send({
          name: 'Updated Name',
          role: 'EDITOR',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Name');
      expect(response.body).toHaveProperty('role', 'EDITOR');
    });

    it('should allow user to update own profile', async () => {
      const mockUser = createMockUser({ id: 'user-id', role: 'VIEWER' });
      const updatedUser = { ...mockUser, name: 'New Name' };

      // First call: authenticate middleware checks user
      // Second call: PUT route checks if user exists
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const token = generateTestToken(mockUser.id, 'VIEWER');
      const response = await request(app)
        .put('/api/users/user-id')
        .set('Cookie', [`access_token=${token}`])
        .send({
          name: 'New Name',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'New Name');
    });

    it('should prevent non-ADMIN from changing role', async () => {
      const mockUser = createMockUser({ id: 'user-id', role: 'VIEWER' });
      // When non-ADMIN tries to change role, it's silently removed and update succeeds
      const updatedUser = { ...mockUser, name: 'New Name', role: 'VIEWER' }; // role stays VIEWER

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const token = generateTestToken(mockUser.id, 'VIEWER');
      const response = await request(app)
        .put('/api/users/user-id')
        .set('Cookie', [`access_token=${token}`])
        .send({
          name: 'New Name',
          role: 'ADMIN', // Trying to elevate privileges
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('role', 'VIEWER'); // Role unchanged
    });

    it('should prevent user from updating other user profiles', async () => {
      const mockUser = createMockUser({ id: 'user-id', role: 'VIEWER' });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const token = generateTestToken(mockUser.id, 'VIEWER');
      const response = await request(app)
        .put('/api/users/other-user-id')
        .set('Cookie', [`access_token=${token}`])
        .send({
          name: 'Hacked Name',
        });

      expect(response.status).toBe(403);
    });

    it('should hash password when updating', async () => {
      const mockUser = createMockUser({ id: 'user-id' });
      const updatedUser = { ...mockUser, password: 'newhash' };

      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockUser);
      mockedBcrypt.hash.mockResolvedValue('newhash' as never);
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const token = generateTestToken(mockUser.id);
      const response = await request(app)
        .put('/api/users/user-id')
        .set('Cookie', [`access_token=${token}`])
        .send({
          password: 'newpassword123',
        });

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
      expect(response.status).toBe(200);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should allow ADMIN to delete users', async () => {
      const mockAdmin = createMockUser({ id: 'admin-id', role: 'ADMIN' });
      const targetUser = createMockUser({ id: 'target-id' });

      (prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockAdmin)
        .mockResolvedValueOnce(targetUser);
      (prisma.user.delete as jest.Mock).mockResolvedValue(targetUser);

      const token = generateTestToken(mockAdmin.id, 'ADMIN');
      const response = await request(app)
        .delete('/api/users/target-id')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should prevent ADMIN from deleting own account', async () => {
      const mockAdmin = createMockUser({ id: 'admin-id', role: 'ADMIN' });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockAdmin);

      const token = generateTestToken(mockAdmin.id, 'ADMIN');
      const response = await request(app)
        .delete('/api/users/admin-id')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 403 for non-ADMIN users', async () => {
      const mockViewer = createMockUser({ role: 'VIEWER' });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockViewer);

      const token = generateTestToken(mockViewer.id, 'VIEWER');
      const response = await request(app)
        .delete('/api/users/some-id')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(403);
    });

    it('should return 404 for non-existent user', async () => {
      const mockAdmin = createMockUser({ role: 'ADMIN' });

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockAdmin).mockResolvedValueOnce(null);
      (prisma.user.delete as jest.Mock).mockResolvedValue(null);

      const token = generateTestToken(mockAdmin.id, 'ADMIN');
      const response = await request(app)
        .delete('/api/users/nonexistent-id')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(404);
    });
  });
});

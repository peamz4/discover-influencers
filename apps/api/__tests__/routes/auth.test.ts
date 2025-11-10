import request from 'supertest';
import bcrypt from 'bcryptjs';
import { createTestApp } from '../helpers/test-app';
import prisma from '../../src/lib/prisma';
import { createMockUser, extractCookies, generateTestToken } from '../helpers/test-helpers';

// Create test app with full middleware
const app = createTestApp();

describe('Authentication Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User',
        });

      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('email', 'newuser@example.com');
      expect(response.body.user).toHaveProperty('name', 'New User');
      expect(response.body.user).not.toHaveProperty('password');
      
      // Verify user was created in database
      const user = await prisma.user.findUnique({
        where: { email: 'newuser@example.com' },
      });
      expect(user).toBeTruthy();
      expect(user?.name).toBe('New User');
    });

    it('should return 400 if user already exists', async () => {
      // Create existing user
      await prisma.user.create({
        data: {
          email: 'existing@example.com',
          password: 'hashedpassword',
          name: 'Existing User',
          role: 'VIEWER',
        },
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'password123',
          name: 'Existing User',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for validation errors', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123', // Too short
          name: '',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should hash password before saving', async () => {
      const mockUser = createMockUser();
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedpassword' as never);
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user with valid credentials', async () => {
      const mockUser = createMockUser({
        email: 'user@example.com',
        password: 'hashedpassword',
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      (prisma.refreshToken.create as jest.Mock).mockResolvedValue({
        id: 'token-id',
        token: 'refresh-token',
        userId: mockUser.id,
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('email', 'user@example.com');
      expect(response.body.user).not.toHaveProperty('password');
      
      // Check for cookies
      const cookies = extractCookies(response);
      expect(cookies).toHaveProperty('access_token');
      expect(cookies).toHaveProperty('refresh_token');
    });

    it('should return 401 for invalid email', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 401 for invalid password', async () => {
      const mockUser = createMockUser();
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user profile', async () => {
      const mockUser = createMockUser();
      const token = generateTestToken(mockUser.id, mockUser.role);

      // Mock response without password (as per select clause)
      const mockUserResponse = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        avatarUrl: mockUser.avatarUrl,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUserResponse);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', mockUser.email);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 if user not found', async () => {
      const token = generateTestToken('nonexistent-id');
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'User not found');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user and clear cookies', async () => {
      const mockUser = createMockUser();
      const token = generateTestToken(mockUser.id);

      (prisma.refreshToken.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', [`access_token=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logged out successfully');
      
      // Check that cookies are cleared
      const cookies = extractCookies(response);
      expect(cookies.access_token).toBeFalsy();
    });

    it('should return 401 without token', async () => {
      const response = await request(app).post('/api/auth/logout');

      expect(response.status).toBe(401);
    });
  });
});

import request from 'supertest';
import { createTestApp } from '../helpers/test-app';
import prisma from '../../src/lib/prisma';
import { hashPassword } from '../../src/lib/auth';

const app = createTestApp();

describe('Authentication Routes (Real DB)', () => {
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
          password: await hashPassword('password123'),
          name: 'Existing User',
          role: 'VIEWER',
        },
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'password123',
          name: 'Another User',
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
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should hash password before saving', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'hashtest@example.com',
          password: 'plainpassword',
          name: 'Hash Test',
        });

      expect(response.status).toBe(201);
      
      // Verify password is hashed in database
      const user = await prisma.user.findUnique({
        where: { email: 'hashtest@example.com' },
      });
      expect(user?.password).not.toBe('plainpassword');
      expect(user?.password).toMatch(/^\$2[aby]\$/); // bcrypt hash prefix (any version)
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user with valid credentials', async () => {
      // Create test user
      const hashedPassword = await hashPassword('password123');
      await prisma.user.create({
        data: {
          email: 'logintest@example.com',
          password: hashedPassword,
          name: 'Login Test',
          role: 'VIEWER',
        },
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logintest@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('email', 'logintest@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 401 for invalid email', async () => {
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
      // Create test user
      const hashedPassword = await hashPassword('correctpassword');
      await prisma.user.create({
        data: {
          email: 'pwtest@example.com',
          password: hashedPassword,
          name: 'Password Test',
          role: 'VIEWER',
        },
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'pwtest@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 400 for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user profile', async () => {
      // Create and login user
      const hashedPassword = await hashPassword('password123');
      const user = await prisma.user.create({
        data: {
          email: 'metest@example.com',
          password: hashedPassword,
          name: 'Me Test',
          role: 'VIEWER',
        },
      });

      // Login to get token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'metest@example.com',
          password: 'password123',
        });

      const cookies = loginResponse.headers['set-cookie'] || [];

      // Get current user
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookies);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', 'metest@example.com');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user and clear cookies', async () => {
      // Create and login user
      const hashedPassword = await hashPassword('password123');
      await prisma.user.create({
        data: {
          email: 'logouttest@example.com',
          password: hashedPassword,
          name: 'Logout Test',
          role: 'VIEWER',
        },
      });

      // Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'logouttest@example.com',
          password: 'password123',
        });

      const cookies = loginResponse.headers['set-cookie'] || [];

      // Logout
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });
});

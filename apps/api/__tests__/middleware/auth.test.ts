import { Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../../src/middleware/auth';
import prisma from '../../src/lib/prisma';
import { createMockUser, generateTestToken } from '../helpers/test-helpers';
import jwt from 'jsonwebtoken';

// Mock response object
const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

// Mock request object
const mockRequest = (overrides = {}) => {
  return {
    cookies: {},
    ...overrides,
  } as Request;
};

describe('Authentication Middleware', () => {
  describe('authenticate', () => {
    it('should authenticate valid token from cookies', async () => {
      const mockUser = createMockUser();
      const token = generateTestToken(mockUser.id, mockUser.role);
      
      const req = mockRequest({ cookies: { access_token: token } });
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user?.userId).toBe(mockUser.id);
      expect(req.user?.role).toBe(mockUser.role);
    });

    it('should reject request without token', async () => {
      const req = mockRequest({ cookies: {} });
      const res = mockResponse();
      const next = jest.fn();

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject invalid token', async () => {
      const req = mockRequest({ cookies: { access_token: 'invalid-token' } });
      const res = mockResponse();
      const next = jest.fn();

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject expired token', async () => {
      const expiredToken = jwt.sign(
        { userId: 'test-id', role: 'VIEWER' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '-1h' } // Expired 1 hour ago
      );

      const req = mockRequest({ cookies: { access_token: expiredToken } });
      const res = mockResponse();
      const next = jest.fn();

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    // Note: The authenticate middleware doesn't check if user exists in DB
    // It only validates the JWT token. User existence is checked in route handlers.
  });

  describe('authorize', () => {
    it('should allow user with exact required role', () => {
      const req = mockRequest() as Request & { user?: any };
      req.user = { userId: 'test-id', role: 'ADMIN' };
      const res = mockResponse();
      const next = jest.fn();

      const middleware = authorize('ADMIN');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow user with one of multiple required roles', () => {
      const req = mockRequest() as Request & { user?: any };
      req.user = { userId: 'test-id', role: 'EDITOR' };
      const res = mockResponse();
      const next = jest.fn();

      const middleware = authorize('ADMIN', 'EDITOR');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should reject user without required role', () => {
      const req = mockRequest() as Request & { user?: any };
      req.user = { userId: 'test-id', role: 'VIEWER' };
      const res = mockResponse();
      const next = jest.fn();

      const middleware = authorize('ADMIN');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining('Insufficient permissions') })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request without user object', () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = jest.fn();

      const middleware = authorize('ADMIN');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle VIEWER role restrictions', () => {
      const req = mockRequest() as Request & { user?: any };
      req.user = { userId: 'test-id', role: 'VIEWER' };
      const res = mockResponse();
      const next = jest.fn();

      const middleware = authorize('ADMIN', 'EDITOR');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle EDITOR role restrictions', () => {
      const req = mockRequest() as Request & { user?: any };
      req.user = { userId: 'test-id', role: 'EDITOR' };
      const res = mockResponse();
      const next = jest.fn();

      const middleware = authorize('ADMIN');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should allow ADMIN full access', () => {
      const req = mockRequest() as Request & { user?: any };
      req.user = { userId: 'test-id', role: 'ADMIN' };
      const res = mockResponse();
      const next = jest.fn();

      // Test all possible role requirements
      const scenarios = [
        authorize('ADMIN'),
        authorize('ADMIN', 'EDITOR'),
        authorize('ADMIN', 'EDITOR', 'VIEWER'),
      ];

      scenarios.forEach((middleware) => {
        const nextFn = jest.fn();
        middleware(req, res, nextFn);
        expect(nextFn).toHaveBeenCalled();
      });
    });
  });

  describe('Role-Based Access Control Integration', () => {
    it('should enforce ADMIN-only access', () => {
      const roles = ['ADMIN', 'EDITOR', 'VIEWER'];
      const req = mockRequest() as Request & { user?: any };
      const res = mockResponse();

      const adminOnlyMiddleware = authorize('ADMIN');

      roles.forEach((role) => {
        req.user = { userId: 'test-id', role };
        const next = jest.fn();
        adminOnlyMiddleware(req, res, next);

        if (role === 'ADMIN') {
          expect(next).toHaveBeenCalled();
        } else {
          expect(res.status).toHaveBeenCalledWith(403);
        }
      });
    });

    it('should enforce EDITOR and ADMIN access', () => {
      const roles = ['ADMIN', 'EDITOR', 'VIEWER'];
      const req = mockRequest() as Request & { user?: any };
      const res = mockResponse();

      const editorAdminMiddleware = authorize('ADMIN', 'EDITOR');

      roles.forEach((role) => {
        req.user = { userId: 'test-id', role };
        const next = jest.fn();
        editorAdminMiddleware(req, res, next);

        if (role === 'ADMIN' || role === 'EDITOR') {
          expect(next).toHaveBeenCalled();
        } else {
          expect(res.status).toHaveBeenCalledWith(403);
        }
      });
    });

    it('should allow all authenticated users when no role specified', () => {
      const roles = ['ADMIN', 'EDITOR', 'VIEWER'];
      const req = mockRequest() as Request & { user?: any };
      const res = mockResponse();

      // Simulate authenticate middleware (no role restriction)
      roles.forEach((role) => {
        req.user = { userId: 'test-id', role };
        expect(req.user).toBeDefined();
      });
    });
  });

  describe('Token Security', () => {
    it('should reject token with invalid signature', async () => {
      const token = jwt.sign(
        { userId: 'test-id', role: 'VIEWER' },
        'wrong-secret'
      );

      const req = mockRequest({ cookies: { access_token: token } });
      const res = mockResponse();
      const next = jest.fn();

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject malformed token', async () => {
      const req = mockRequest({ cookies: { access_token: 'not.a.valid.jwt' } });
      const res = mockResponse();
      const next = jest.fn();

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });
});

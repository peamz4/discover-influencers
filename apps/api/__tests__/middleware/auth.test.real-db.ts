import { Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../../src/middleware/auth';
import { createTestUser } from '../helpers/test-data';
import { generateTestToken } from '../helpers/test-helpers';

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

describe('Authentication Middleware (Real DB)', () => {
  describe('authenticate', () => {
    it('should authenticate valid token from cookies', async () => {
      // Create a real user
      const user = await createTestUser({ email: 'auth-test@example.com', role: 'ADMIN' });
      const token = generateTestToken(user.id, user.role);
      
      const req = mockRequest({ cookies: { access_token: token } });
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
      expect(req.user?.userId).toBe(user.id);
      expect(req.user?.role).toBe(user.role);
    });

    it('should reject request without token', async () => {
      const req = mockRequest({ cookies: {} });
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject invalid token', async () => {
      const req = mockRequest({ cookies: { access_token: 'invalid-token' } });
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('authorize', () => {
    it('should allow user with exact required role', () => {
      const req = mockRequest() as Request;
      req.user = { userId: '123', email: 'test@example.com', role: 'ADMIN' };
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      const middleware = authorize('ADMIN');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow user with one of multiple required roles', () => {
      const req = mockRequest() as Request;
      req.user = { userId: '123', email: 'test@example.com', role: 'EDITOR' };
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      const middleware = authorize('ADMIN', 'EDITOR');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should reject user without required role', () => {
      const req = mockRequest() as Request;
      req.user = { userId: '123', email: 'test@example.com', role: 'VIEWER' };
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      const middleware = authorize('ADMIN');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Insufficient permissions' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});

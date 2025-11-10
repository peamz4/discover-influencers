import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../src/middleware/error';

describe('Error Handling Middleware', () => {
  const mockRequest = () => ({
    path: '/test',
    method: 'GET',
  } as Request);
  
  const mockResponse = () => {
    const res = {} as Response;
    res.statusCode = 200;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle generic errors with 500 status', () => {
    const error = new Error('Test error');
    const req = mockRequest();
    const res = mockResponse();

    errorHandler(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Test error',
      })
    );
  });

  it('should handle errors with custom status codes', () => {
    const error = new Error('Not found');
    const req = mockRequest();
    const res = mockResponse();
    res.statusCode = 404;

    errorHandler(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Not found',
      })
    );
  });

  it('should handle validation errors', () => {
    const error = new Error('Validation failed');
    const req = mockRequest();
    const res = mockResponse();
    res.statusCode = 400;

    errorHandler(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should handle authentication errors', () => {
    const error = new Error('Unauthorized');
    const req = mockRequest();
    const res = mockResponse();
    res.statusCode = 401;

    errorHandler(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should handle forbidden errors', () => {
    const error = new Error('Forbidden');
    const req = mockRequest();
    const res = mockResponse();
    res.statusCode = 403;

    errorHandler(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('should return error message in response', () => {
    const error = new Error('Custom error message');
    const req = mockRequest();
    const res = mockResponse();

    errorHandler(error, req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Custom error message',
      })
    );
  });
});

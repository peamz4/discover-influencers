import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/server';

// Vercel serverless function handler
export default async (req: VercelRequest, res: VercelResponse) => {
  // Set CORS headers for Vercel serverless
  const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Pass to Express app
  return app(req, res);
};

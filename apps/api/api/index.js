const app = require('../dist/src/server').default;

module.exports = async (req, res) => {
  // Set CORS headers IMMEDIATELY for all requests
  const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  
  // Handle OPTIONS preflight - respond immediately without going to Express
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  
  // For all other requests, pass to Express app
  try {
    return app(req, res);
  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

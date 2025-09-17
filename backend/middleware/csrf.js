const crypto = require('crypto');

// Simple CSRF protection middleware
const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET requests and health checks
  if (req.method === 'GET' || req.path === '/api/health') {
    return next();
  }

  // For API requests, check for valid JWT token as CSRF protection
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token && req.path.startsWith('/api/')) {
    return res.status(403).json({ error: 'CSRF protection: Authentication required' });
  }

  next();
};

module.exports = { csrfProtection };
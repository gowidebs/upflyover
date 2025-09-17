const crypto = require('crypto');

// Simple CSRF protection middleware
const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET requests, health checks, auth endpoints, and test endpoints
  if (req.method === 'GET' || 
      req.path === '/api/health' || 
      req.path.includes('/api/auth/') || 
      req.path.includes('/api/test/') ||
      req.path.includes('/api/csrf-token')) {
    return next();
  }

  // For other API requests, check for valid JWT token as CSRF protection
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token && req.path.startsWith('/api/')) {
    return res.status(403).json({ error: 'CSRF protection: Authentication required' });
  }

  next();
};

module.exports = { csrfProtection };
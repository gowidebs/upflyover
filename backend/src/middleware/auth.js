const jwt = require('jsonwebtoken');
const Company = require('../models/Company');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'upflyover-secret-key');
    
    // Check if company still exists and is active
    const company = await Company.findById(decoded.companyId);
    if (!company || !company.isActive) {
      return res.status(401).json({ error: 'Invalid token or company not found.' });
    }
    
    req.companyId = decoded.companyId;
    req.company = company;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed.' });
  }
};

module.exports = auth;
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');

const cookieAuth = async (req, res, next) => {
  try {
    // Get token from HTTP-only cookie
    const token = req.cookies.upflyover_auth;
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'upflyover-jwt-secret-key-2024');
    
    // Get company from database
    const company = await Company.findById(decoded.companyId).select('-password');
    if (!company || !company.isActive) {
      return res.status(401).json({ error: 'Invalid token or company not found.' });
    }

    req.companyId = decoded.companyId;
    req.company = company;
    next();
  } catch (error) {
    console.error('Cookie auth error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = cookieAuth;
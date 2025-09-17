const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const auth = require('../middleware/auth');

const router = express.Router();

// Register new company
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { name, email, password, industry, companySize, country } = req.body;
    
    // Check if company already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ error: 'Company already registered with this email' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create company
    const company = new Company({
      name,
      email,
      password: hashedPassword,
      industry,
      companySize,
      address: { country }
    });
    
    await company.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { companyId: company._id },
      process.env.JWT_SECRET || 'upflyover-jwt-secret-key-2024',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'Company registered successfully',
      token,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        verificationStatus: company.verificationStatus
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login with secure HTTP-only cookies
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find company
    const company = await Company.findOne({ email, isActive: true });
    if (!company) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, company.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    company.lastLogin = new Date();
    await company.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { companyId: company._id },
      process.env.JWT_SECRET || 'upflyover-jwt-secret-key-2024',
      { expiresIn: '7d' }
    );
    
    // Set secure HTTP-only cookie
    res.cookie('upflyover_auth', token, {
      httpOnly: true,        // Prevents XSS attacks
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict',    // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });
    
    res.json({
      message: 'Login successful',
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        verificationStatus: company.verificationStatus,
        subscription: company.subscription
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current company profile (using cookie auth)
const cookieAuth = require('../middleware/cookieAuth');
router.get('/profile', cookieAuth, async (req, res) => {
  try {
    res.json({ company: req.company });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Logout (clear secure cookie)
router.post('/logout', (req, res) => {
  res.clearCookie('upflyover_auth', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
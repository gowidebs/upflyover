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
      process.env.JWT_SECRET || 'upflyover-secret-key',
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

// Login
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
      process.env.JWT_SECRET || 'upflyover-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
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

// Get current company profile
router.get('/profile', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.companyId).select('-password');
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json({ company });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
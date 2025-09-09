const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { sendVerificationEmail } = require('./utils/emailService');

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));
}

const app = express();
const PORT = process.env.PORT || 5002;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// In-memory storage (replace with database in production)
const companies = [];
const verificationTokens = [];
const kycDocuments = [];

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, company) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.company = company;
    next();
  });
};

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, industry, companySize, country, contactPerson, phone, website } = req.body;

    // Check if company already exists
    const existingCompany = companies.find(c => c.email === email);
    if (existingCompany) {
      return res.status(400).json({ error: 'Company already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = uuidv4();

    // Create company
    const company = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      industry,
      companySize,
      country,
      contactPerson: contactPerson || '',
      phone: phone || '',
      website: website || '',
      createdAt: new Date(),
      emailVerified: false,
      kycStatus: 'pending', // pending, submitted, approved, rejected
      kycSubmittedAt: null,
      profileComplete: false,
      twoFactorEnabled: false
    };

    companies.push(company);

    // Store verification token
    verificationTokens.push({
      token: verificationToken,
      companyId: company.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    // Auto-verify for testing (disable email requirement)
    company.emailVerified = true;

    // Generate JWT token for immediate login
    const token = jwt.sign(
      { id: company.id, email: company.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return company data without password
    const { password: _, ...companyData } = company;

    res.status(201).json({
      message: 'Company registered successfully!',
      token,
      company: companyData
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Email verification endpoint
app.post('/api/auth/verify-email', (req, res) => {
  try {
    const { token } = req.body;

    // Find verification token
    const verificationRecord = verificationTokens.find(vt => vt.token === token);
    if (!verificationRecord) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    // Check if token expired
    if (new Date() > verificationRecord.expiresAt) {
      return res.status(400).json({ error: 'Verification token expired' });
    }

    // Find and update company
    const company = companies.find(c => c.id === verificationRecord.companyId);
    if (!company) {
      return res.status(400).json({ error: 'Company not found' });
    }

    company.emailVerified = true;

    // Remove used token
    const tokenIndex = verificationTokens.findIndex(vt => vt.token === token);
    verificationTokens.splice(tokenIndex, 1);

    // Generate JWT token for login
    const jwtToken = jwt.sign(
      { id: company.id, email: company.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...companyData } = company;

    res.json({
      message: 'Email verified successfully',
      token: jwtToken,
      company: companyData
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find company
    const company = companies.find(c => c.email === email);
    if (!company) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, company.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Auto-verify for testing
    company.emailVerified = true;

    // Generate JWT token
    const token = jwt.sign(
      { id: company.id, email: company.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return company data without password
    const { password: _, ...companyData } = company;

    res.json({
      message: 'Login successful',
      token,
      company: companyData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get profile endpoint
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  const company = companies.find(c => c.id === req.company.id);
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }

  const { password: _, ...companyData } = company;
  res.json({ company: companyData });
});

// KYC document submission
app.post('/api/kyc/submit', authenticateToken, upload.fields([
  { name: 'businessLicense', maxCount: 1 },
  { name: 'taxCertificate', maxCount: 1 },
  { name: 'bankStatement', maxCount: 1 },
  { name: 'ownershipProof', maxCount: 1 }
]), (req, res) => {
  try {
    const { businessRegistrationNumber, taxId, bankAccountNumber, description } = req.body;
    const companyId = req.company.id;

    // Find company
    const company = companies.find(c => c.id === companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Create KYC record
    const kycRecord = {
      id: uuidv4(),
      companyId,
      businessRegistrationNumber,
      taxId,
      bankAccountNumber,
      description,
      documents: {
        businessLicense: req.files.businessLicense?.[0]?.filename,
        taxCertificate: req.files.taxCertificate?.[0]?.filename,
        bankStatement: req.files.bankStatement?.[0]?.filename,
        ownershipProof: req.files.ownershipProof?.[0]?.filename
      },
      submittedAt: new Date(),
      status: 'submitted'
    };

    kycDocuments.push(kycRecord);

    // Update company KYC status
    company.kycStatus = 'submitted';
    company.kycSubmittedAt = new Date();

    res.json({
      message: 'KYC documents submitted successfully',
      kycId: kycRecord.id
    });
  } catch (error) {
    console.error('KYC submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update company profile
app.put('/api/company/profile', authenticateToken, (req, res) => {
  try {
    const companyId = req.company.id;
    const updates = req.body;

    // Find company
    const company = companies.find(c => c.id === companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Update allowed fields
    const allowedFields = ['name', 'contactPerson', 'phone', 'website', 'industry', 'country', 'companySize', 'description', 'address'];
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        company[field] = updates[field];
      }
    });

    // Check if profile is complete
    const requiredFields = ['name', 'contactPerson', 'phone', 'industry', 'country', 'companySize'];
    company.profileComplete = requiredFields.every(field => company[field] && company[field].trim() !== '');

    const { password: _, ...companyData } = company;

    res.json({
      message: 'Profile updated successfully',
      company: companyData
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get KYC status
app.get('/api/kyc/status', authenticateToken, (req, res) => {
  try {
    const companyId = req.company.id;
    const kycRecord = kycDocuments.find(kyc => kyc.companyId === companyId);
    
    res.json({
      status: kycRecord?.status || 'pending',
      submittedAt: kycRecord?.submittedAt,
      documents: kycRecord?.documents || {}
    });
  } catch (error) {
    console.error('KYC status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Password reset endpoint
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const company = companies.find(c => c.email === email);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    // Reset to test password
    const newPassword = 'newpassword123';
    company.password = await bcrypt.hash(newPassword, 10);
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
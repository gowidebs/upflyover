const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
// Twilio service with error handling
let sendSMSOTP, sendEmailOTP, verifyOTP;
try {
  const smsService = require('./utils/smsService');
  sendSMSOTP = smsService.sendSMSOTP;
  sendEmailOTP = smsService.sendEmailOTP;
  verifyOTP = smsService.verifyOTP;
} catch (error) {
  console.log('Twilio service not available, using fallback');
  sendSMSOTP = async () => ({ success: false });
  sendEmailOTP = async () => ({ success: false });
  verifyOTP = async () => ({ success: false });
}

// CSRF Protection
const { csrfProtection } = require('./middleware/csrf');

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => {
      console.error('MongoDB connection error:', err);
      // Continue without MongoDB for now
    });
} else {
  console.log('No MongoDB URI provided, using in-memory storage');
}

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'upflyover-jwt-secret-key-2024';

// Middleware
app.use(cors({
  origin: ['https://upflyover.vercel.app', 'https://gowidetest.click', 'https://www.gowidetest.click', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
// Skip CSRF for registration endpoints
app.use((req, res, next) => {
  if (req.path.includes('/api/auth/') || req.path.includes('/api/health')) {
    return next();
  }
  return csrfProtection(req, res, next);
});
app.use('/uploads', express.static('uploads'));

// Create uploads directory
try {
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads', { recursive: true });
    console.log('Created uploads directory');
  }
} catch (error) {
  console.error('Failed to create uploads directory:', error);
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|zip|rar|txt|xls|xlsx|ppt|pptx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    // Allow common business file types
    const allowedMimeTypes = [
      'image/jpeg', 'image/jpg', 'image/png',
      'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip', 'application/x-zip-compressed',
      'application/x-rar-compressed',
      'text/plain',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    
    if (extname || allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: PDF, DOC, DOCX, ZIP, RAR, JPG, PNG, TXT, XLS, PPT'));
    }
  }
});

// Hybrid Database System - Free start, easy scaling
let useDatabase = false;
let Company, Individual, KYCModel;

// MongoDB Schemas (only created when needed)
const createModels = () => {
  const CompanySchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    industry: String,
    companySize: String,
    country: String,
    contactPerson: String,
    phone: String,
    website: String,
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    kycStatus: { type: String, default: 'pending' },
    accountActive: { type: Boolean, default: false },
    userType: { type: String, default: 'company' }
  }, { timestamps: true });

  const IndividualSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    fullName: String,
    phone: String,
    emiratesId: String,
    dateOfBirth: Date,
    nationality: String,
    address: String,
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    kycStatus: { type: String, default: 'pending' },
    accountActive: { type: Boolean, default: false },
    userType: { type: String, default: 'individual' },
    requirementsPosted: { type: Number, default: 0 },
    monthlyLimit: { type: Number, default: 4 }
  }, { timestamps: true });

  const KYCSchema = new mongoose.Schema({
    userId: String,
    userType: { type: String, enum: ['company', 'individual'] },
    // Company KYC fields
    businessRegistrationNumber: String,
    taxId: String,
    description: String,
    // Individual KYC fields
    fullName: String,
    emiratesId: String,
    dateOfBirth: Date,
    nationality: String,
    address: String,
    documents: {
      // Company documents
      businessLicense: String,
      taxCertificate: String,
      // Individual documents
      emiratesIdFront: String,
      emiratesIdBack: String,
      passport: String
    },
    status: { type: String, default: 'submitted' }
  }, { timestamps: true });

  return {
    Company: mongoose.model('Company', CompanySchema),
    Individual: mongoose.model('Individual', IndividualSchema),
    KYCModel: mongoose.model('KYC', KYCSchema)
  };
};

// Enable MongoDB for persistent storage
if (process.env.MONGODB_URI) {
  mongoose.connection.on('connected', () => {
    const models = createModels();
    Company = models.Company;
    Individual = models.Individual;
    KYCModel = models.KYCModel;
    useDatabase = true;
    console.log('🗄️ MongoDB connected - using persistent storage');
    
    // Migrate existing in-memory data
    migrateExistingData();
  });
  
  mongoose.connection.on('error', (err) => {
    console.log('💾 MongoDB error, using in-memory storage:', err.message);
    useDatabase = false;
  });
} else {
  console.log('💾 Using in-memory storage (Free tier)');
}

// Migrate existing in-memory data to MongoDB
const migrateExistingData = async () => {
  if (!useDatabase || companies.length === 0) return;
  
  try {
    for (const company of companies) {
      const exists = await Company.findOne({ email: company.email });
      if (!exists) {
        await new Company(company).save();
        console.log('Migrated company:', company.email);
      }
    }
    
    for (const kyc of kycDocuments) {
      const exists = await KYCModel.findOne({ companyId: kyc.companyId });
      if (!exists) {
        await new KYCModel(kyc).save();
        console.log('Migrated KYC:', kyc.companyId);
      }
    }
  } catch (error) {
    console.log('Migration error:', error.message);
  }
};

// In-memory storage (free tier)
let companies = [];
let individuals = [];
let kycDocuments = [];
let requirements = [];
let applications = [];
const otpStorage = [];

// Auto-migration function (when you add MongoDB later)
const migrateToDatabase = async () => {
  if (!useDatabase && process.env.MONGODB_URI) {
    try {
      const models = createModels();
      Company = models.Company;
      KYCModel = models.KYCModel;
      
      // Migrate existing data
      for (const company of companies) {
        await new Company(company).save();
      }
      for (const kyc of kycDocuments) {
        await new KYCModel(kyc).save();
      }
      
      useDatabase = true;
      console.log('✅ Migrated to MongoDB successfully!');
      return true;
    } catch (error) {
      console.log('Migration failed, continuing with in-memory');
      return false;
    }
  }
  return false;
};

// Database abstraction layer
const DB = {
  async findCompany(query) {
    if (useDatabase && Company) {
      return await Company.findOne(query);
    }
    return companies.find(c => Object.keys(query).every(key => c[key] === query[key]));
  },
  
  async saveCompany(companyData) {
    if (useDatabase && Company) {
      const company = new Company(companyData);
      const saved = await company.save();
      return saved;
    }
    const company = { id: uuidv4(), ...companyData, createdAt: new Date() };
    companies.push(company);
    return company;
  },
  
  async updateCompany(id, updates) {
    if (useDatabase && Company) {
      return await Company.findByIdAndUpdate(id, updates, { new: true });
    }
    const company = companies.find(c => c.id === id || c._id?.toString() === id);
    if (company) {
      Object.assign(company, updates);
      return company;
    }
    return null;
  }
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.company = user; // Keep as req.company for backward compatibility
    next();
  });
};





// Individual registration endpoint
app.post('/api/auth/individual/register', async (req, res) => {
  try {
    const { email, password, userType, provider, googleId, fullName, emailVerified } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingIndividual = individuals.find(u => u.email === email);
    const existingCompany = companies.find(c => c.email === email);
    
    if (existingIndividual || existingCompany) {
      // For Google OAuth, if user exists, log them in instead
      if (provider === 'google' && emailVerified) {
        const existingUser = existingIndividual || existingCompany;
        
        // Generate JWT token for login
        const token = jwt.sign(
          { id: existingUser.id, email: existingUser.email, userType: existingUser.userType },
          JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        return res.status(200).json({
          message: 'Google login successful!',
          token,
          user: {
            id: existingUser.id,
            email: existingUser.email,
            userType: existingUser.userType,
            fullName: existingUser.fullName || existingUser.name,
            emailVerified: existingUser.emailVerified,
            phoneVerified: existingUser.phoneVerified,
            kycStatus: existingUser.kycStatus,
            accountActive: existingUser.accountActive
          },
          isExistingUser: true
        });
      }
      
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create individual user
    const individual = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      userType: 'individual',
      fullName: fullName || '',
      provider: provider || 'email',
      googleId: googleId || null,
      emailVerified: emailVerified || false,
      phoneVerified: false,
      kycStatus: 'pending',
      accountActive: false,
      requirementsPosted: 0,
      monthlyLimit: 4,
      createdAt: new Date()
    };

    individuals.push(individual);

    // Skip email verification for Google OAuth users
    if (provider === 'google' && emailVerified) {
      res.status(201).json({
        message: 'Google registration successful! Please select your user type.',
        userId: individual.id,
        requiresVerification: false,
        provider: 'google'
      });
      return;
    }

    // Send email OTP for verification (email signup only)
    try {
      const emailResult = await sendEmailOTP(email);
      
      if (!emailResult.success) {
        return res.status(500).json({ 
          error: 'Email verification service temporarily unavailable. Please try again later.',
          code: 'VERIFICATION_SERVICE_ERROR'
        });
      }
    } catch (error) {
      console.error('Email OTP service error:', error);
      return res.status(500).json({ 
        error: 'Account verification is required but currently unavailable. Please try again later.',
        code: 'VERIFICATION_REQUIRED'
      });
    }

    res.status(201).json({
      message: 'Registration successful! Please verify your email address.',
      userId: individual.id,
      requiresVerification: true
    });
  } catch (error) {
    console.error('Individual registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Company register endpoint (existing)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, industry, companySize, country, contactPerson, phone, website } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if company already exists
    const existingCompany = await DB.findCompany({ email });
    if (existingCompany) {
      return res.status(400).json({ error: 'Company already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create company using database abstraction
    const company = await DB.saveCompany({
      name,
      email,
      password: hashedPassword,
      industry: industry || '',
      companySize: companySize || '',
      country: country || '',
      contactPerson: contactPerson || '',
      phone: phone || '',
      website: website || '',
      emailVerified: false,
      phoneVerified: false,
      kycStatus: 'pending',
      accountActive: false,
      userType: 'company'
    });

    // Store verification record
    const companyId = company._id ? company._id.toString() : company.id;
    otpStorage.push({
      companyId,
      email: email,
      phone: phone,
      emailVerified: false,
      phoneVerified: false,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send OTPs via Twilio Verify (STRICT - No fallback for security)
    try {
      const emailResult = await sendEmailOTP(email);
      const smsResult = await sendSMSOTP(phone);
      
      console.log(`OTPs sent - Email: ${emailResult.success}, SMS: ${smsResult.success}`);
      
      // SECURITY: If OTP sending fails, registration fails (no fake accounts)
      if (!emailResult.success || !smsResult.success) {
        console.error('OTP sending failed - registration blocked for security');
        return res.status(500).json({ 
          error: 'Verification service temporarily unavailable. Please try again later.',
          code: 'VERIFICATION_SERVICE_ERROR'
        });
      }
    } catch (error) {
      console.error('Critical: OTP service error - blocking registration:', error);
      return res.status(500).json({ 
        error: 'Account verification is required but currently unavailable. Please try again later.',
        code: 'VERIFICATION_REQUIRED'
      });
    }

    // SECURITY: Always require verification for B2B platform
    res.status(201).json({
      message: 'Registration successful! Please verify your email and phone number to ensure account security.',
      companyId: companyId,
      requiresVerification: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify email OTP
app.post('/api/auth/verify-email-otp', async (req, res) => {
  try {
    const { companyId, otp } = req.body;

    // Find OTP record
    const otpRecord = otpStorage.find(o => o.companyId === companyId);
    if (!otpRecord) {
      return res.status(400).json({ error: 'OTP not found or expired' });
    }

    // Check if OTP expired
    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    // Verify email OTP with Twilio
    const emailVerifyResult = await verifyOTP(otpRecord.email, otp);
    if (!emailVerifyResult.success) {
      return res.status(400).json({ error: 'Invalid email OTP' });
    }

    // Find and update company
    const company = await DB.updateCompany(companyId, { emailVerified: true });
    if (!company) {
      return res.status(400).json({ error: 'Company not found' });
    }

    res.json({
      message: 'Email verified successfully',
      emailVerified: true,
      phoneVerified: company.phoneVerified
    });
  } catch (error) {
    console.error('Email OTP verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify phone OTP
app.post('/api/auth/verify-phone-otp', async (req, res) => {
  try {
    const { companyId, otp } = req.body;

    // Find OTP record
    const otpRecord = otpStorage.find(o => o.companyId === companyId);
    if (!otpRecord) {
      return res.status(400).json({ error: 'OTP not found or expired' });
    }

    // Check if OTP expired
    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    // Verify phone OTP with Twilio
    const phoneVerifyResult = await verifyOTP(otpRecord.phone, otp);
    if (!phoneVerifyResult.success) {
      return res.status(400).json({ error: 'Invalid phone OTP' });
    }

    // Find and update company
    const company = await DB.updateCompany(companyId, { phoneVerified: true });
    if (!company) {
      return res.status(400).json({ error: 'Company not found' });
    }

    res.json({
      message: 'Phone verified successfully',
      emailVerified: company.emailVerified,
      phoneVerified: true
    });
  } catch (error) {
    console.error('Phone OTP verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Complete verification and login
app.post('/api/auth/complete-verification', async (req, res) => {
  try {
    const { companyId } = req.body;

    // Find company
    const company = await DB.findCompany(useDatabase ? { _id: companyId } : { id: companyId });
    if (!company) {
      return res.status(400).json({ error: 'Company not found' });
    }

    // SECURITY: Require BOTH email AND phone verification for B2B platform
    if (!company.emailVerified || !company.phoneVerified) {
      return res.status(400).json({ 
        error: 'Please verify both your email and phone number before accessing the platform',
        requiresVerification: true,
        companyId: company.id,
        verificationStatus: {
          emailVerified: company.emailVerified,
          phoneVerified: company.phoneVerified
        }
      });
    }

    // Remove OTP record
    const otpIndex = otpStorage.findIndex(o => o.companyId === companyId);
    if (otpIndex !== -1) {
      otpStorage.splice(otpIndex, 1);
    }

    // Generate JWT token for login
    const token = jwt.sign(
      { id: company.id, email: company.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...companyData } = company;

    res.json({
      message: 'Verification completed successfully',
      token,
      company: companyData
    });
  } catch (error) {
    console.error('Complete verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Resend OTP
app.post('/api/auth/resend-otp', async (req, res) => {
  try {
    const { companyId, type } = req.body; // type: 'email' or 'phone'

    // Find company
    const company = await DB.findCompany(useDatabase ? { _id: companyId } : { id: companyId });
    if (!company) {
      return res.status(400).json({ error: 'Company not found' });
    }

    // Find OTP record
    let otpRecord = otpStorage.find(o => o.companyId === companyId);
    if (!otpRecord) {
      return res.status(400).json({ error: 'No verification session found' });
    }

    // Update expiry
    otpRecord.expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Send OTP via Twilio Verify
    if (type === 'email') {
      await sendEmailOTP(company.email);
    } else {
      await sendSMSOTP(company.phone);
    }

    res.json({
      message: `${type === 'email' ? 'Email' : 'Phone'} OTP sent successfully`
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify remaining contact method (for logged-in users)
app.post('/api/auth/verify-remaining', authenticateToken, async (req, res) => {
  try {
    const { type } = req.body; // 'email' or 'phone'
    const companyId = req.company.id;

    // Find company
    const company = await DB.findCompany(useDatabase ? { _id: companyId } : { id: companyId });
    if (!company) {
      return res.status(400).json({ error: 'Company not found' });
    }

    // Check what needs verification
    if (type === 'email' && company.emailVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }
    if (type === 'phone' && company.phoneVerified) {
      return res.status(400).json({ error: 'Phone already verified' });
    }

    // Create OTP record for remaining verification
    const existingOtpIndex = otpStorage.findIndex(o => o.companyId === companyId);
    if (existingOtpIndex !== -1) {
      otpStorage.splice(existingOtpIndex, 1);
    }

    otpStorage.push({
      companyId,
      email: company.email,
      phone: company.phone,
      emailVerified: company.emailVerified,
      phoneVerified: company.phoneVerified,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    // Send OTP for remaining verification
    if (type === 'email') {
      await sendEmailOTP(company.email);
    } else {
      await sendSMSOTP(company.phone);
    }

    res.json({
      message: `${type === 'email' ? 'Email' : 'Phone'} verification code sent successfully`
    });
  } catch (error) {
    console.error('Verify remaining error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unified login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user (company or individual)
    let user = await DB.findCompany({ email });
    let userType = 'company';
    
    if (!user) {
      user = individuals.find(u => u.email === email);
      userType = 'individual';
    }

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(400).json({ 
        error: 'Please verify your email address first',
        requiresVerification: true,
        userId: user.id,
        userType
      });
    }

    // Check if user type is selected (for new users)
    if (!user.userType || user.userType === 'pending') {
      return res.status(200).json({
        message: 'Please select your account type',
        requiresUserTypeSelection: true,
        userId: user.id,
        email: user.email
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data without password
    const { password: _, ...userData } = user;

    res.json({
      message: 'Login successful',
      token,
      user: {
        ...userData,
        userType,
        needsKyc: user.kycStatus === 'pending' || user.kycStatus === 'rejected',
        kycSubmitted: user.kycStatus === 'submitted',
        accountActive: user.accountActive === true,
        needsAdditionalVerification: !user.phoneVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get profile endpoint
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  let user;
  
  if (req.company.userType === 'company') {
    user = await DB.findCompany(useDatabase ? { _id: req.company.id } : { id: req.company.id });
  } else {
    user = individuals.find(u => u.id === req.company.id);
  }
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password: _, ...userData } = user;
  res.json({ user: userData });
});

// KYC document submission
app.post('/api/kyc/submit', authenticateToken, (req, res) => {
  try {
    const { businessRegistrationNumber, taxId, description } = req.body;
    const companyId = req.company.id;

    console.log('KYC submission attempt:', { companyId, businessRegistrationNumber, taxId });

    // Validate required fields
    if (!businessRegistrationNumber || !taxId) {
      return res.status(400).json({ error: 'Business registration number and tax ID are required' });
    }

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
      description: description || '',
      documents: {
        businessLicense: 'pending_upload',
        taxCertificate: 'pending_upload'
      },
      submittedAt: new Date(),
      status: 'submitted'
    };

    kycDocuments.push(kycRecord);

    // Update company KYC status
    company.kycStatus = 'submitted';
    company.kycSubmittedAt = new Date();
    company.accountActive = false;

    console.log('KYC record created successfully:', kycRecord.id);

    res.json({
      message: 'KYC information submitted successfully! Your account will be activated within 1-2 business days after verification.',
      kycId: kycRecord.id
    });
  } catch (error) {
    console.error('KYC submission error:', error);
    res.status(500).json({ error: 'Failed to submit KYC information. Please try again.' });
  }
});

// Update company profile
app.put('/api/company/profile', authenticateToken, async (req, res) => {
  try {
    const companyId = req.company.id;
    const updates = req.body;

    // Find company
    const company = companies.find(c => c.id === companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Update allowed fields
    const allowedFields = [
      'name', 'contactPerson', 'phone', 'website', 'industry', 'country', 'companySize', 
      'description', 'address', 'tagline', 'yearEstablished', 'teamSize', 'linkedIn',
      'facebook', 'twitter', 'instagram', 'services', 'portfolio', 'certifications'
    ];
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
app.get('/api/kyc/status', authenticateToken, async (req, res) => {
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

// Admin: Get all KYC submissions
app.get('/api/admin/kyc/submissions', async (req, res) => {
  try {
    const submissions = kycDocuments.map(kyc => {
      let userName = 'Unknown';
      let userEmail = 'Unknown';
      
      if (kyc.userType === 'company') {
        const company = companies.find(c => c.id === kyc.userId);
        userName = company?.name || 'Unknown Company';
        userEmail = company?.email || 'Unknown';
      } else if (kyc.userType === 'individual') {
        const individual = individuals.find(i => i.id === kyc.userId);
        userName = individual?.fullName || 'Unknown Individual';
        userEmail = individual?.email || 'Unknown';
      }
      
      return {
        ...kyc,
        userName,
        userEmail,
        userType: kyc.userType || 'company'
      };
    });
    res.json(submissions);
  } catch (error) {
    console.error('Admin KYC fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Review KYC submission
app.post('/api/admin/kyc/review', async (req, res) => {
  try {
    const { kycId, action, notes } = req.body;
    
    const kycRecord = kycDocuments.find(kyc => kyc.id === kycId);
    if (!kycRecord) {
      return res.status(404).json({ error: 'KYC record not found' });
    }

    let user;
    if (kycRecord.userType === 'company') {
      user = companies.find(c => c.id === kycRecord.userId);
    } else {
      user = individuals.find(i => i.id === kycRecord.userId);
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update KYC status
    kycRecord.status = action === 'approve' ? 'approved' : 'rejected';
    kycRecord.reviewedAt = new Date();
    kycRecord.reviewNotes = notes;

    // Update user status
    user.kycStatus = kycRecord.status;
    user.accountActive = action === 'approve';

    res.json({
      message: `KYC ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      status: kycRecord.status
    });
  } catch (error) {
    console.error('KYC review error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Serve KYC documents
app.get('/api/admin/kyc/document/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);
    
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Document serve error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Password reset/setup endpoint
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user (company or individual)
    let user = companies.find(c => c.email === email);
    let userType = 'company';
    
    if (!user) {
      user = individuals.find(i => i.email === email);
      userType = 'individual';
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate a secure reset token
    const resetToken = uuidv4();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    // Store reset token (in production, use database)
    user.resetToken = resetToken;
    user.resetExpiry = resetExpiry;
    
    // In production, send email with reset link
    // For now, return the token for testing
    const resetLink = `https://upflyover.vercel.app/reset-password?token=${resetToken}&email=${email}`;
    
    res.json({ 
      message: 'Password reset link sent to your email',
      resetLink, // Remove this in production
      userType
    });
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed' });
  }
});

// Set new password with token
app.post('/api/auth/set-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    
    if (!email || !token || !newPassword) {
      return res.status(400).json({ error: 'Email, token, and new password are required' });
    }
    
    // Find user
    let user = companies.find(c => c.email === email);
    if (!user) {
      user = individuals.find(i => i.email === email);
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify token and expiry
    if (user.resetToken !== token || new Date() > user.resetExpiry) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    
    // Clear reset token
    delete user.resetToken;
    delete user.resetExpiry;
    
    res.json({ message: 'Password set successfully. You can now login with your email and password.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set password' });
  }
});

// Admin: Get platform statistics
app.get('/api/admin/stats', (req, res) => {
  const stats = {
    totalRegistrations: companies.length + individuals.length,
    totalCompanies: companies.length,
    totalIndividuals: individuals.length,
    verifiedCompanies: companies.filter(c => c.emailVerified && c.phoneVerified).length,
    verifiedIndividuals: individuals.filter(i => i.emailVerified && i.phoneVerified).length,
    kycSubmissions: kycDocuments.length,
    approvedKyc: kycDocuments.filter(k => k.status === 'approved').length,
    pendingKyc: kycDocuments.filter(k => k.status === 'submitted').length,
    activeAccounts: companies.filter(c => c.accountActive).length + individuals.filter(i => i.accountActive).length,
    totalRequirements: requirements.length,
    openRequirements: requirements.filter(r => r.status === 'open').length,
    totalApplications: applications.length,
    recentRegistrations: [...companies, ...individuals].filter(u => {
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return new Date(u.createdAt || u.updatedAt) > dayAgo;
    }).length
  };
  
  res.json(stats);
});

// Download requirement attachment
app.get('/api/requirements/:id/download/:filename', authenticateToken, (req, res) => {
  try {
    const { id, filename } = req.params;
    
    // Find requirement
    const requirement = requirements.find(req => req.id === id);
    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }
    
    // Check if file exists in requirement attachments
    const attachment = requirement.attachments?.find(att => att.filename === filename);
    if (!attachment) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const filePath = path.join(__dirname, 'uploads', filename);
    
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Disposition', `attachment; filename="${attachment.originalName}"`);
      res.sendFile(filePath);
    } else {
      res.status(404).json({ error: 'File not found on server' });
    }
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Admin: Clear all data (for development)
app.post('/api/admin/clear-all', (req, res) => {
  const { adminKey } = req.body;
  const ADMIN_KEY = process.env.ADMIN_KEY || 'temp-admin-key-change-in-production';
  if (adminKey !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Invalid admin key' });
  }
  
  companies.length = 0;
  individuals.length = 0;
  kycDocuments.length = 0;
  requirements.length = 0;
  applications.length = 0;
  otpStorage.length = 0;
  
  res.json({ message: 'All data cleared successfully' });
});

// Requirements endpoints

// Get all requirements (only for companies)
app.get('/api/requirements', authenticateToken, async (req, res) => {
  try {
    const userType = req.company.userType;
    
    // Only companies can browse requirements
    if (userType !== 'company') {
      return res.status(403).json({ error: 'Only companies can browse requirements. Individuals can only post requirements.' });
    }

    // Check if company account is active
    const company = companies.find(c => c.id === req.company.id);
    if (!company || !company.accountActive) {
      return res.status(400).json({ error: 'Please complete KYC verification to browse requirements' });
    }
    
    const allRequirements = requirements.map(req => {
      let posterName = 'Anonymous';
      
      if (req.userType === 'company') {
        const posterCompany = companies.find(c => c.id === req.userId);
        posterName = posterCompany?.name || 'Company';
      } else {
        const posterIndividual = individuals.find(i => i.id === req.userId);
        posterName = posterIndividual?.fullName || 'Individual';
      }
      
      return {
        ...req,
        posterName,
        posterType: req.userType,
        isRecommended: false // Will add smart matching later
      };
    });
    
    // Sort by date (newest first)
    const sortedRequirements = allRequirements.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    res.json({ requirements: sortedRequirements });
  } catch (error) {
    console.error('Error loading requirements:', error);
    res.status(500).json({ error: 'Failed to load requirements' });
  }
});

// Get my requirements
app.get('/api/requirements/my', authenticateToken, async (req, res) => {
  try {
    const userId = req.company.id;
    const userType = req.company.userType;
    const myRequirements = requirements.filter(req => req.userId === userId);
    
    // Add application count and remaining limit for individuals
    const requirementsWithApps = myRequirements.map(req => ({
      ...req,
      applications: applications.filter(app => app.requirementId === req.id).length
    }));

    let responseData = { requirements: requirementsWithApps };

    // Add limit info for individuals
    if (userType === 'individual') {
      const individual = individuals.find(u => u.id === userId);
      responseData.limitInfo = {
        posted: individual?.requirementsPosted || 0,
        limit: individual?.monthlyLimit || 4,
        remaining: (individual?.monthlyLimit || 4) - (individual?.requirementsPosted || 0)
      };
    }
    
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load requirements' });
  }
});

// Post new requirement (supports both individuals and companies)
app.post('/api/requirements', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, budget, timeline, location, requirements: reqText } = req.body;
    const userId = req.company.id;
    const userType = req.company.userType;
    
    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }

    // Check if individual user has reached monthly limit
    if (userType === 'individual') {
      const individual = individuals.find(u => u.id === userId);
      if (!individual) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if account is active (KYC approved)
      if (!individual.accountActive) {
        return res.status(400).json({ error: 'Please complete KYC verification to post requirements' });
      }

      // Check monthly limit (reset logic would be implemented with proper date tracking)
      if (individual.requirementsPosted >= individual.monthlyLimit) {
        return res.status(400).json({ 
          error: `You have reached your monthly limit of ${individual.monthlyLimit} requirements. Upgrade to Professional plan for unlimited posting.`,
          code: 'MONTHLY_LIMIT_REACHED'
        });
      }
    } else {
      // Company user - check if account is active
      const company = companies.find(c => c.id === userId);
      if (!company || !company.accountActive) {
        return res.status(400).json({ error: 'Please complete KYC verification to browse requirements' });
      }
    }
    
    const requirement = {
      id: uuidv4(),
      userId,
      userType,
      title,
      description,
      category,
      budget: budget || '',
      timeline: timeline || '',
      location: location || '',
      requirements: reqText || '',
      attachments: [],
      status: 'open',
      createdAt: new Date(),
      applications: 0
    };
    
    requirements.push(requirement);

    // Increment individual's requirement count
    if (userType === 'individual') {
      const individual = individuals.find(u => u.id === userId);
      individual.requirementsPosted += 1;
    }
    
    res.json({ success: true, requirement });
  } catch (error) {
    console.error('Error posting requirement:', error);
    res.status(500).json({ error: 'Failed to post requirement' });
  }
});

// Apply to requirement (only companies can apply)
app.post('/api/requirements/:id/apply', authenticateToken, async (req, res) => {
  try {
    const requirementId = req.params.id;
    const userId = req.company.id;
    const userType = req.company.userType;
    const { proposal, timeline, budget, experience, portfolio } = req.body;
    
    // Only companies can apply to requirements
    if (userType !== 'company') {
      return res.status(403).json({ error: 'Only companies can apply to requirements' });
    }

    // Check if company account is active
    const company = companies.find(c => c.id === userId);
    if (!company || !company.accountActive) {
      return res.status(400).json({ error: 'Please complete KYC verification to apply to requirements' });
    }
    
    if (!proposal) {
      return res.status(400).json({ error: 'Proposal is required' });
    }
    
    // Check if already applied
    const existingApp = applications.find(app => 
      app.requirementId === requirementId && app.companyId === userId
    );
    
    if (existingApp) {
      return res.status(400).json({ error: 'You have already applied to this requirement' });
    }
    
    const requirement = requirements.find(req => req.id === requirementId);
    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }
    
    const application = {
      id: uuidv4(),
      requirementId,
      companyId: userId,
      requirementTitle: requirement.title,
      proposal,
      timeline: timeline || '',
      budget: budget || '',
      experience: experience || '',
      portfolio: portfolio || '',
      status: 'pending',
      appliedAt: new Date()
    };
    
    applications.push(application);
    
    res.json({ success: true, application });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get my applications (only for companies)
app.get('/api/applications/my', authenticateToken, async (req, res) => {
  try {
    const userId = req.company.id;
    const userType = req.company.userType;
    
    // Only companies have applications
    if (userType !== 'company') {
      return res.status(403).json({ error: 'Only companies can view applications' });
    }
    
    const myApplications = applications.filter(app => app.companyId === userId);
    res.json({ applications: myApplications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load applications' });
  }
});

// Get applications for my requirements
app.get('/api/requirements/:id/applications', authenticateToken, async (req, res) => {
  try {
    const requirementId = req.params.id;
    const userId = req.company.id;
    
    // Verify requirement belongs to user
    const requirement = requirements.find(req => req.id === requirementId && req.userId === userId);
    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }
    
    const reqApplications = applications.filter(app => app.requirementId === requirementId);
    
    // Add company info to applications
    const applicationsWithCompany = reqApplications.map(app => ({
      ...app,
      companyName: companies.find(c => c.id === app.companyId)?.name || 'Anonymous',
      companyEmail: companies.find(c => c.id === app.companyId)?.email || ''
    }));
    
    res.json({ applications: applicationsWithCompany });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load applications' });
  }
});

// Test KYC submission (for testing only)
app.post('/api/test/kyc', (req, res) => {
  try {
    const { businessRegistrationNumber, taxId, description } = req.body;
    
    if (!businessRegistrationNumber || !taxId) {
      return res.status(400).json({ error: 'Business registration number and tax ID are required' });
    }
    
    const kycRecord = {
      id: uuidv4(),
      companyId: 'test-company',
      businessRegistrationNumber,
      taxId,
      description: description || '',
      documents: {
        businessLicense: 'pending_upload',
        taxCertificate: 'pending_upload'
      },
      submittedAt: new Date(),
      status: 'submitted'
    };
    
    kycDocuments.push(kycRecord);
    
    res.json({
      message: 'KYC test submission successful!',
      kycId: kycRecord.id
    });
  } catch (error) {
    res.status(500).json({ error: 'Test failed: ' + error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});// Force rebuild Wed Sep 10 19:20:00 +04 2025 - Individual signup system deployed
// Individual email verification
app.post('/api/auth/individual/verify-email', async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const individual = individuals.find(u => u.id === userId);
    if (!individual) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify email OTP with Twilio
    const emailVerifyResult = await verifyOTP(individual.email, otp);
    if (!emailVerifyResult.success) {
      return res.status(400).json({ error: 'Invalid email OTP' });
    }

    individual.emailVerified = true;

    res.json({
      message: 'Email verified successfully',
      userId: individual.id,
      email: individual.email
    });
  } catch (error) {
    console.error('Individual email verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User type selection
app.post('/api/auth/select-user-type', async (req, res) => {
  try {
    const { userId, userType } = req.body;

    let user;
    if (userType === 'individual') {
      user = individuals.find(u => u.id === userId);
    } else {
      user = companies.find(c => c.id === userId);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.userType = userType;

    res.json({
      message: 'User type selected successfully',
      userType
    });
  } catch (error) {
    console.error('User type selection error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Individual mobile verification
app.post('/api/auth/individual/verify-mobile', async (req, res) => {
  try {
    const { userId, phone } = req.body;

    const individual = individuals.find(u => u.id === userId);
    if (!individual) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send SMS OTP
    const smsResult = await sendSMSOTP(phone);
    if (!smsResult.success) {
      return res.status(500).json({ error: 'Failed to send SMS OTP' });
    }

    individual.phone = phone;

    res.json({
      message: 'OTP sent to your mobile number'
    });
  } catch (error) {
    console.error('Individual mobile verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Individual OTP verification
app.post('/api/auth/individual/verify-otp', async (req, res) => {
  try {
    const { userId, phone, otp } = req.body;

    const individual = individuals.find(u => u.id === userId);
    if (!individual) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify phone OTP with Twilio
    const phoneVerifyResult = await verifyOTP(phone, otp);
    if (!phoneVerifyResult.success) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    individual.phoneVerified = true;

    res.json({
      message: 'Mobile number verified successfully'
    });
  } catch (error) {
    console.error('Individual OTP verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Individual personal details
app.post('/api/auth/individual/personal-details', async (req, res) => {
  try {
    const { userId, fullName, emiratesId, dateOfBirth, nationality, address } = req.body;

    const individual = individuals.find(u => u.id === userId);
    if (!individual) {
      return res.status(404).json({ error: 'User not found' });
    }

    individual.fullName = fullName;
    individual.emiratesId = emiratesId;
    individual.dateOfBirth = dateOfBirth;
    individual.nationality = nationality;
    individual.address = address;

    res.json({
      message: 'Personal details saved successfully'
    });
  } catch (error) {
    console.error('Individual personal details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Individual KYC submission
app.post('/api/auth/individual/kyc-submit', upload.fields([
  { name: 'emiratesIdFront', maxCount: 1 },
  { name: 'emiratesIdBack', maxCount: 1 },
  { name: 'passport', maxCount: 1 }
]), async (req, res) => {
  try {
    const { userId } = req.body;

    const individual = individuals.find(u => u.id === userId);
    if (!individual) {
      return res.status(404).json({ error: 'User not found' });
    }

    const kycRecord = {
      id: uuidv4(),
      userId,
      userType: 'individual',
      fullName: individual.fullName,
      emiratesId: individual.emiratesId,
      dateOfBirth: individual.dateOfBirth,
      nationality: individual.nationality,
      address: individual.address,
      documents: {
        emiratesIdFront: req.files?.emiratesIdFront?.[0]?.filename,
        emiratesIdBack: req.files?.emiratesIdBack?.[0]?.filename,
        passport: req.files?.passport?.[0]?.filename
      },
      submittedAt: new Date(),
      status: 'submitted'
    };

    kycDocuments.push(kycRecord);
    individual.kycStatus = 'submitted';

    res.json({
      message: 'KYC documents submitted successfully! Your account will be reviewed within 1-2 business days.',
      kycId: kycRecord.id
    });
  } catch (error) {
    console.error('Individual KYC submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add phone verification after KYC approval
app.post('/api/kyc/verify-phone', authenticateToken, async (req, res) => {
  try {
    const { phone } = req.body;
    const companyId = req.company.id;

    // Find company
    const company = companies.find(c => c.id === companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Check if KYC is approved
    if (company.kycStatus !== 'approved') {
      return res.status(400).json({ error: 'Complete KYC verification first' });
    }

    // Update phone and mark as verified (simplified for now)
    company.phone = phone;
    company.phoneVerified = true;

    res.json({
      message: 'Phone number verified successfully',
      phoneVerified: true
    });
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

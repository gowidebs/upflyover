const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { sendSMSOTP, sendEmailOTP, verifyOTP } = require('./utils/smsService');

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
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors({
  origin: ['https://upflyover.vercel.app', 'https://gowidetest.click', 'https://www.gowidetest.click', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
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

// Hybrid Database System - Free start, easy scaling
let useDatabase = false;
let Company, KYCModel;

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
    accountActive: { type: Boolean, default: false }
  }, { timestamps: true });

  const KYCSchema = new mongoose.Schema({
    companyId: String,
    businessRegistrationNumber: String,
    taxId: String,
    description: String,
    documents: {
      businessLicense: String,
      taxCertificate: String
    },
    status: { type: String, default: 'submitted' }
  }, { timestamps: true });

  return {
    Company: mongoose.model('Company', CompanySchema),
    KYCModel: mongoose.model('KYC', KYCSchema)
  };
};

// Auto-detect database availability
if (process.env.MONGODB_URI && mongoose.connection.readyState === 1) {
  const models = createModels();
  Company = models.Company;
  KYCModel = models.KYCModel;
  useDatabase = true;
  console.log('🗄️ Using MongoDB Atlas (Production)');
} else {
  console.log('💾 Using in-memory storage (Free tier - auto-scales to MongoDB)');
}

// In-memory storage (free tier)
let companies = [];
let kycDocuments = [];
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
    if (useDatabase) {
      return await Company.findOne(query);
    }
    return companies.find(c => Object.keys(query).every(key => c[key] === query[key]));
  },
  
  async saveCompany(companyData) {
    if (useDatabase) {
      const company = new Company(companyData);
      return await company.save();
    }
    const company = { id: uuidv4(), ...companyData };
    companies.push(company);
    return company;
  },
  
  async updateCompany(id, updates) {
    if (useDatabase) {
      return await Company.findByIdAndUpdate(id, updates, { new: true });
    }
    const company = companies.find(c => c.id === id || c._id === id);
    if (company) Object.assign(company, updates);
    return company;
  }
};

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
    const existingCompany = await DB.findCompany({ email });
    if (existingCompany) {
      return res.status(400).json({ error: 'Company already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create company using abstraction layer
    const company = await DB.saveCompany({
      name,
      email,
      password: hashedPassword,
      industry,
      companySize,
      country,
      contactPerson: contactPerson || '',
      phone: phone || '',
      website: website || '',
      emailVerified: false,
      phoneVerified: false,
      kycStatus: 'pending',
      accountActive: false
    });

    // Store verification record
    otpStorage.push({
      companyId: company.id,
      email: email,
      phone: phone,
      emailVerified: false,
      phoneVerified: false,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send OTPs via Twilio Verify
    try {
      const emailResult = await sendEmailOTP(email);
      const smsResult = await sendSMSOTP(phone);
      
      console.log(`OTPs sent - Email: ${emailResult.success}, SMS: ${smsResult.success}`);
      
      if (!emailResult.success || !smsResult.success) {
        console.error('OTP sending failed:', { emailResult, smsResult });
      }
    } catch (error) {
      console.error('Error sending OTPs:', error);
    }

    res.status(201).json({
      message: 'Registration successful! Please verify your email and phone number.',
      companyId: company.id,
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

    // Check if both email and phone are verified
    if (!company.emailVerified || !company.phoneVerified) {
      return res.status(400).json({ error: 'Please verify both email and phone number' });
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

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find company
    const company = await DB.findCompany({ email });
    if (!company) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, company.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if email and phone are verified
    if (!company.emailVerified || !company.phoneVerified) {
      return res.status(400).json({ 
        error: 'Please verify your email and phone number before logging in',
        requiresVerification: true,
        companyId: company.id
      });
    }

    // Allow login but indicate KYC status
    const needsKyc = company.kycStatus === 'pending' || company.kycStatus === 'rejected';
    const kycSubmitted = company.kycStatus === 'submitted';
    const accountActive = company.accountActive === true;

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
      company: {
        ...companyData,
        needsKyc,
        kycSubmitted,
        accountActive
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get profile endpoint
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  const company = await DB.findCompany(useDatabase ? { _id: req.company.id } : { id: req.company.id });
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }

  const { password: _, ...companyData } = company;
  res.json({ company: companyData });
});

// KYC document submission
app.post('/api/kyc/submit', authenticateToken, (req, res) => {
  const uploadHandler = upload.fields([
    { name: 'businessLicense', maxCount: 1 },
    { name: 'taxCertificate', maxCount: 1 }
  ]);

  uploadHandler(req, res, (err) => {
    if (err) {
      console.error('File upload error:', err);
      if (err.code === 'ENOENT') {
        return res.status(500).json({ error: 'Upload directory not accessible' });
      }
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }

    try {
      const { businessRegistrationNumber, taxId, description } = req.body;
      const companyId = req.company.id;

      console.log('KYC submission data:', { companyId, businessRegistrationNumber, taxId, files: req.files });

      // Find company
      const company = await DB.findCompany(useDatabase ? { _id: companyId } : { id: companyId });
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }

      // Validate required fields
      if (!businessRegistrationNumber || !taxId) {
        return res.status(400).json({ error: 'Business registration number and tax ID are required' });
      }

      // Check if at least one document is uploaded
      const hasDocuments = req.files && Object.keys(req.files).length > 0;
      if (!hasDocuments) {
        return res.status(400).json({ error: 'At least one document must be uploaded' });
      }

      // Create KYC record
      const kycRecord = {
        id: uuidv4(),
        companyId,
        businessRegistrationNumber,
        taxId,
        description: description || '',
        documents: {
          businessLicense: req.files?.businessLicense?.[0]?.filename || null,
          taxCertificate: req.files?.taxCertificate?.[0]?.filename || null
        },
        submittedAt: new Date(),
        status: 'submitted'
      };

      kycDocuments.push(kycRecord);

      // Update company KYC status
      await DB.updateCompany(companyId, {
        kycStatus: 'submitted',
        kycSubmittedAt: new Date(),
        accountActive: false
      });

      console.log('KYC record created:', kycRecord.id);

      res.json({
        message: 'KYC documents submitted successfully',
        kycId: kycRecord.id
      });
    } catch (error) {
      console.error('KYC submission error:', error);
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  });
});

// Update company profile
app.put('/api/company/profile', authenticateToken, (req, res) => {
  try {
    const companyId = req.company.id;
    const updates = req.body;

    // Find company
    const company = await DB.findCompany(useDatabase ? { _id: companyId } : { id: companyId });
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

// Admin: Get all KYC submissions
app.get('/api/admin/kyc/submissions', (req, res) => {
  try {
    const submissions = await Promise.all(kycDocuments.map(async kyc => {
      const company = await DB.findCompany(useDatabase ? { _id: kyc.companyId } : { id: kyc.companyId });
      return {
        ...kyc,
        companyName: company?.name || 'Unknown',
        companyEmail: company?.email || 'Unknown'
      };
    }));
    res.json(submissions);
  } catch (error) {
    console.error('Admin KYC fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Review KYC submission
app.post('/api/admin/kyc/review', (req, res) => {
  try {
    const { kycId, action, notes } = req.body;
    
    const kycRecord = kycDocuments.find(kyc => kyc.id === kycId);
    if (!kycRecord) {
      return res.status(404).json({ error: 'KYC record not found' });
    }

    const company = await DB.findCompany(useDatabase ? { _id: kycRecord.companyId } : { id: kycRecord.companyId });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Update KYC status
    kycRecord.status = action === 'approve' ? 'approved' : 'rejected';
    kycRecord.reviewedAt = new Date();
    kycRecord.reviewNotes = notes;

    // Update company status
    await DB.updateCompany(kycRecord.companyId, {
      kycStatus: kycRecord.status,
      accountActive: action === 'approve'
    });

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

// Password reset endpoint
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const company = await DB.findCompany({ email });
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

// Admin: Clear all data (for development)
app.post('/api/admin/clear-all', (req, res) => {
  const { adminKey } = req.body;
  if (adminKey !== 'upflyover2025') {
    return res.status(403).json({ error: 'Invalid admin key' });
  }
  
  companies.length = 0;
  kycDocuments.length = 0;
  otpStorage.length = 0;
  
  res.json({ message: 'All data cleared successfully' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});// Force rebuild Wed Sep 10 15:16:00 +04 2025

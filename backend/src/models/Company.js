const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  
  // Company Details
  description: { type: String, maxlength: 1000 },
  website: { type: String },
  phone: { type: String },
  logo: { type: String }, // URL to logo image
  
  // Location
  address: {
    street: String,
    city: String,
    state: String,
    country: { type: String, required: true },
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Business Information
  industry: { type: String, required: true },
  subIndustries: [String],
  companySize: {
    type: String,
    enum: ['startup', 'small', 'medium', 'large', 'enterprise'],
    required: true
  },
  yearEstablished: Number,
  
  // Verification & Trust
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  trustScore: { type: Number, default: 0, min: 0, max: 100 },
  
  // Capabilities
  capabilities: {
    canSupply: { type: Boolean, default: true },
    canReceive: { type: Boolean, default: true },
    services: [String],
    products: [String],
    certifications: [String]
  },
  
  // Subscription
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    expiresAt: Date,
    features: [String]
  },
  
  // Analytics
  stats: {
    totalDeals: { type: Number, default: 0 },
    successfulDeals: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 }
  },
  
  // Settings
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    privacy: {
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false }
    }
  },
  
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, {
  timestamps: true
});

// Indexes for better query performance
companySchema.index({ email: 1 });
companySchema.index({ industry: 1, companySize: 1 });
companySchema.index({ 'address.country': 1, 'address.city': 1 });
companySchema.index({ verificationStatus: 1, isActive: 1 });

module.exports = mongoose.model('Company', companySchema);
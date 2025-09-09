const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, maxlength: 2000 },
  
  // Requirement Details
  category: { type: String, required: true },
  subcategory: String,
  type: {
    type: String,
    enum: ['product', 'service', 'project', 'partnership'],
    required: true
  },
  
  // Posted by
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  
  // Requirements Specifications
  specifications: {
    quantity: Number,
    unit: String,
    budget: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'USD' }
    },
    timeline: {
      startDate: Date,
      endDate: Date,
      duration: String
    },
    location: {
      preferred: [String], // Countries/cities
      remote: { type: Boolean, default: false }
    }
  },
  
  // Supplier Criteria
  supplierCriteria: {
    companySize: [String], // ['small', 'medium', 'large']
    industries: [String],
    countries: [String],
    certifications: [String],
    minTrustScore: { type: Number, default: 0 }
  },
  
  // Status & Workflow
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'cancelled', 'completed'],
    default: 'draft'
  },
  
  // EOI Management
  eois: [{
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    submittedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'shortlisted', 'rejected', 'selected'],
      default: 'pending'
    },
    message: String,
    attachments: [String]
  }],
  
  // Quotations
  quotations: [{
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    timeline: String,
    terms: String,
    attachments: [String],
    submittedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'negotiating'],
      default: 'pending'
    }
  }],
  
  // Selected Deal
  selectedQuotation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  
  // Visibility & Promotion
  visibility: {
    type: String,
    enum: ['public', 'private', 'featured'],
    default: 'public'
  },
  
  // Analytics
  stats: {
    views: { type: Number, default: 0 },
    eoiCount: { type: Number, default: 0 },
    quotationCount: { type: Number, default: 0 }
  },
  
  // Deadlines
  deadlines: {
    eoiDeadline: Date,
    quotationDeadline: Date,
    projectDeadline: Date
  },
  
  // Tags for better searchability
  tags: [String],
  
  // Attachments
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }],
  
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes
requirementSchema.index({ company: 1, status: 1 });
requirementSchema.index({ category: 1, type: 1 });
requirementSchema.index({ 'specifications.budget.min': 1, 'specifications.budget.max': 1 });
requirementSchema.index({ tags: 1 });
requirementSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Requirement', requirementSchema);
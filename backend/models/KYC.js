const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  businessRegistrationNumber: { type: String, required: true },
  taxId: { type: String, required: true },
  description: String,
  documents: {
    businessLicense: String,
    taxCertificate: String
  },
  status: { type: String, default: 'submitted' },
  reviewedAt: Date,
  reviewNotes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('KYC', kycSchema);
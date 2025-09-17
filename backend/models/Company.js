const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  industry: String,
  companySize: String,
  country: String,
  contactPerson: String,
  phone: String,
  website: String,
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  kycStatus: { type: String, default: 'pending' },
  kycSubmittedAt: Date,
  profileComplete: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  accountActive: { type: Boolean, default: false },
  description: String,
  address: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema);
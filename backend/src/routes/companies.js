const express = require('express');
const Company = require('../models/Company');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all companies with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      industry,
      country,
      companySize,
      search,
      verified = false
    } = req.query;

    const filter = { isActive: true };
    
    if (verified === 'true') {
      filter.verificationStatus = 'verified';
    }
    
    if (industry) filter.industry = industry;
    if (country) filter['address.country'] = country;
    if (companySize) filter.companySize = companySize;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const companies = await Company.find(filter)
      .select('-password -settings')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Company.countDocuments(filter);

    res.json({
      companies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get company by ID
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .select('-password -settings');
    
    if (!company || !company.isActive) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Increment profile views
    await Company.findByIdAndUpdate(req.params.id, {
      $inc: { 'stats.profileViews': 1 }
    });

    res.json({ company });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// Update company profile (protected)
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      description,
      website,
      phone,
      address,
      capabilities,
      certifications
    } = req.body;

    const updateData = {};
    if (description) updateData.description = description;
    if (website) updateData.website = website;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = { ...req.company.address, ...address };
    if (capabilities) updateData.capabilities = { ...req.company.capabilities, ...capabilities };
    if (certifications) updateData['capabilities.certifications'] = certifications;

    const company = await Company.findByIdAndUpdate(
      req.companyId,
      updateData,
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', company });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get company statistics (protected, own company only)
router.get('/stats/dashboard', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.companyId);
    
    res.json({
      stats: company.stats,
      verificationStatus: company.verificationStatus,
      trustScore: company.trustScore,
      subscription: company.subscription
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
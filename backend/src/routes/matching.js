const express = require('express');
const Company = require('../models/Company');
const Requirement = require('../models/Requirement');
const auth = require('../middleware/auth');

const router = express.Router();

// Get AI-matched requirements for current company
router.get('/requirements', auth, async (req, res) => {
  try {
    const company = req.company;
    
    // Build matching criteria based on company profile
    const matchingCriteria = {
      status: 'active',
      isActive: true,
      company: { $ne: company._id } // Exclude own requirements
    };

    // Match by industry
    if (company.industry) {
      matchingCriteria.$or = [
        { category: company.industry },
        { 'supplierCriteria.industries': company.industry }
      ];
    }

    // Match by company size
    if (company.companySize) {
      matchingCriteria['supplierCriteria.companySize'] = { 
        $in: [company.companySize, null] 
      };
    }

    // Match by location
    if (company.address?.country) {
      matchingCriteria.$or = matchingCriteria.$or || [];
      matchingCriteria.$or.push({
        'supplierCriteria.countries': { $in: [company.address.country, null] }
      });
    }

    // Match by trust score
    matchingCriteria['supplierCriteria.minTrustScore'] = { 
      $lte: company.trustScore || 0 
    };

    const requirements = await Requirement.find(matchingCriteria)
      .populate('company', 'name industry address.country verificationStatus')
      .limit(20)
      .sort({ createdAt: -1 });

    // Calculate match scores (simple algorithm)
    const scoredRequirements = requirements.map(req => {
      let score = 0;
      
      // Industry match
      if (req.category === company.industry) score += 30;
      
      // Location match
      if (req.specifications?.location?.preferred?.includes(company.address?.country)) {
        score += 20;
      }
      
      // Company size preference
      if (req.supplierCriteria?.companySize?.includes(company.companySize)) {
        score += 15;
      }
      
      // Verification status
      if (company.verificationStatus === 'verified') score += 10;
      
      // Trust score
      if (company.trustScore >= (req.supplierCriteria?.minTrustScore || 0)) {
        score += 15;
      }
      
      // Recency bonus
      const daysSincePosted = (Date.now() - req.createdAt) / (1000 * 60 * 60 * 24);
      if (daysSincePosted < 7) score += 10;

      return { ...req.toObject(), matchScore: score };
    });

    // Sort by match score
    scoredRequirements.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ 
      requirements: scoredRequirements,
      total: scoredRequirements.length 
    });
  } catch (error) {
    console.error('Get matched requirements error:', error);
    res.status(500).json({ error: 'Failed to fetch matched requirements' });
  }
});

// Get AI-matched companies for networking
router.get('/companies', auth, async (req, res) => {
  try {
    const company = req.company;
    
    const matchingCriteria = {
      isActive: true,
      verificationStatus: 'verified',
      _id: { $ne: company._id } // Exclude self
    };

    // Match by industry (same or complementary)
    if (company.industry) {
      matchingCriteria.$or = [
        { industry: company.industry }, // Same industry
        { 'capabilities.services': { $regex: company.industry, $options: 'i' } }
      ];
    }

    // Match by location (same country or region)
    if (company.address?.country) {
      matchingCriteria['address.country'] = company.address.country;
    }

    const companies = await Company.find(matchingCriteria)
      .select('-password -settings')
      .limit(20)
      .sort({ trustScore: -1, 'stats.successfulDeals': -1 });

    // Calculate compatibility scores
    const scoredCompanies = companies.map(comp => {
      let score = 0;
      
      // Industry compatibility
      if (comp.industry === company.industry) score += 25;
      
      // Location match
      if (comp.address?.country === company.address?.country) score += 20;
      
      // Company size compatibility
      const sizeOrder = ['startup', 'small', 'medium', 'large', 'enterprise'];
      const companyIndex = sizeOrder.indexOf(company.companySize);
      const targetIndex = sizeOrder.indexOf(comp.companySize);
      if (Math.abs(companyIndex - targetIndex) <= 1) score += 15;
      
      // Trust score
      score += Math.min(comp.trustScore || 0, 20);
      
      // Success rate
      if (comp.stats.totalDeals > 0) {
        const successRate = comp.stats.successfulDeals / comp.stats.totalDeals;
        score += successRate * 15;
      }
      
      // Verification bonus
      if (comp.verificationStatus === 'verified') score += 5;

      return { ...comp.toObject(), compatibilityScore: score };
    });

    // Sort by compatibility score
    scoredCompanies.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json({ 
      companies: scoredCompanies,
      total: scoredCompanies.length 
    });
  } catch (error) {
    console.error('Get matched companies error:', error);
    res.status(500).json({ error: 'Failed to fetch matched companies' });
  }
});

// Get matching statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const company = req.company;
    
    // Count potential matches
    const requirementMatches = await Requirement.countDocuments({
      status: 'active',
      isActive: true,
      company: { $ne: company._id },
      $or: [
        { category: company.industry },
        { 'supplierCriteria.industries': company.industry }
      ]
    });

    const companyMatches = await Company.countDocuments({
      isActive: true,
      verificationStatus: 'verified',
      _id: { $ne: company._id },
      industry: company.industry
    });

    res.json({
      potentialRequirements: requirementMatches,
      potentialPartners: companyMatches,
      matchingAccuracy: 85, // Placeholder for ML model accuracy
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Get matching stats error:', error);
    res.status(500).json({ error: 'Failed to fetch matching statistics' });
  }
});

module.exports = router;
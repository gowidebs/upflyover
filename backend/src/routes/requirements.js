const express = require('express');
const Requirement = require('../models/Requirement');
const auth = require('../middleware/auth');
const { validateRequirement } = require('../middleware/validation');

const router = express.Router();

// Get all requirements with filtering
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      type,
      status = 'active',
      country,
      budget_min,
      budget_max,
      search
    } = req.query;

    const filter = { status, isActive: true };
    
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (country) filter['specifications.location.preferred'] = country;
    if (budget_min || budget_max) {
      filter['specifications.budget'] = {};
      if (budget_min) filter['specifications.budget.min'] = { $gte: Number(budget_min) };
      if (budget_max) filter['specifications.budget.max'] = { $lte: Number(budget_max) };
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const requirements = await Requirement.find(filter)
      .populate('company', 'name industry address.country verificationStatus')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Requirement.countDocuments(filter);

    res.json({
      requirements,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get requirements error:', error);
    res.status(500).json({ error: 'Failed to fetch requirements' });
  }
});

// Create new requirement (protected)
router.post('/', auth, validateRequirement, async (req, res) => {
  try {
    const requirement = new Requirement({
      ...req.body,
      company: req.companyId
    });

    await requirement.save();
    await requirement.populate('company', 'name industry address.country');

    res.status(201).json({
      message: 'Requirement created successfully',
      requirement
    });
  } catch (error) {
    console.error('Create requirement error:', error);
    res.status(500).json({ error: 'Failed to create requirement' });
  }
});

// Get requirement by ID
router.get('/:id', async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id)
      .populate('company', 'name industry address.country verificationStatus logo')
      .populate('eois.company', 'name industry verificationStatus')
      .populate('quotations.company', 'name industry verificationStatus');

    if (!requirement || !requirement.isActive) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    // Increment views
    await Requirement.findByIdAndUpdate(req.params.id, {
      $inc: { 'stats.views': 1 }
    });

    res.json({ requirement });
  } catch (error) {
    console.error('Get requirement error:', error);
    res.status(500).json({ error: 'Failed to fetch requirement' });
  }
});

// Submit EOI (protected)
router.post('/:id/eoi', auth, async (req, res) => {
  try {
    const { message, attachments = [] } = req.body;
    
    const requirement = await Requirement.findById(req.params.id);
    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    // Check if company already submitted EOI
    const existingEOI = requirement.eois.find(
      eoi => eoi.company.toString() === req.companyId
    );
    if (existingEOI) {
      return res.status(400).json({ error: 'EOI already submitted' });
    }

    // Add EOI
    requirement.eois.push({
      company: req.companyId,
      message,
      attachments
    });

    requirement.stats.eoiCount += 1;
    await requirement.save();

    res.json({ message: 'EOI submitted successfully' });
  } catch (error) {
    console.error('Submit EOI error:', error);
    res.status(500).json({ error: 'Failed to submit EOI' });
  }
});

// Submit quotation (protected)
router.post('/:id/quotations', auth, async (req, res) => {
  try {
    const { amount, currency = 'USD', timeline, terms, attachments = [] } = req.body;
    
    const requirement = await Requirement.findById(req.params.id);
    if (!requirement) {
      return res.status(404).json({ error: 'Requirement not found' });
    }

    // Check if company has submitted EOI and it's approved
    const eoi = requirement.eois.find(
      eoi => eoi.company.toString() === req.companyId && eoi.status === 'shortlisted'
    );
    if (!eoi) {
      return res.status(403).json({ error: 'Must be shortlisted to submit quotation' });
    }

    // Add quotation
    requirement.quotations.push({
      company: req.companyId,
      amount,
      currency,
      timeline,
      terms,
      attachments
    });

    requirement.stats.quotationCount += 1;
    await requirement.save();

    res.json({ message: 'Quotation submitted successfully' });
  } catch (error) {
    console.error('Submit quotation error:', error);
    res.status(500).json({ error: 'Failed to submit quotation' });
  }
});

module.exports = router;
const Joi = require('joi');

const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required()
      .messages({
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
      }),
    industry: Joi.string().required(),
    companySize: Joi.string().valid('startup', 'small', 'medium', 'large', 'enterprise').required(),
    country: Joi.string().required()
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  next();
};

const validateRequirement = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(20).max(2000).required(),
    category: Joi.string().required(),
    type: Joi.string().valid('product', 'service', 'project', 'partnership').required(),
    specifications: Joi.object({
      quantity: Joi.number().min(1),
      unit: Joi.string(),
      budget: Joi.object({
        min: Joi.number().min(0),
        max: Joi.number().min(0),
        currency: Joi.string().default('USD')
      }),
      timeline: Joi.object({
        startDate: Joi.date(),
        endDate: Joi.date(),
        duration: Joi.string()
      })
    }),
    tags: Joi.array().items(Joi.string())
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateRequirement
};
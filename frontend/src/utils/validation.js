// Production-ready validation utilities

export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  },

  password: (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    return null;
  },

  phone: (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phone) return 'Phone number is required';
    if (!phoneRegex.test(phone)) return 'Please enter a valid phone number';
    return null;
  },

  otp: (otp) => {
    if (!otp) return 'Verification code is required';
    if (!/^\d{6}$/.test(otp)) return 'Verification code must be 6 digits';
    return null;
  },

  required: (value, fieldName) => {
    if (!value || value.trim() === '') return `${fieldName} is required`;
    return null;
  },

  companyName: (name) => {
    if (!name) return 'Company name is required';
    if (name.length < 2) return 'Company name must be at least 2 characters';
    if (name.length > 100) return 'Company name must be less than 100 characters';
    return null;
  },

  fullName: (name) => {
    if (!name) return 'Full name is required';
    if (name.length < 2) return 'Full name must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Full name can only contain letters and spaces';
    return null;
  },

  emiratesId: (id) => {
    if (!id) return 'Emirates ID is required';
    if (!/^\d{3}-\d{4}-\d{7}-\d{1}$/.test(id)) return 'Please enter a valid Emirates ID (XXX-XXXX-XXXXXXX-X)';
    return null;
  },

  website: (url) => {
    if (!url) return null; // Optional field
    const urlRegex = /^https?:\/\/.+\..+/;
    if (!urlRegex.test(url)) return 'Please enter a valid website URL';
    return null;
  }
};

export const validateForm = (formData, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const fieldRules = Array.isArray(rules[field]) ? rules[field] : [rules[field]];
    
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Common validation rules for different forms
export const validationRules = {
  individualSignup: {
    email: validators.email,
    password: validators.password
  },
  
  companySignup: {
    name: validators.companyName,
    email: validators.email,
    password: validators.password,
    phone: validators.phone,
    contactPerson: (value) => validators.required(value, 'Contact person'),
    website: validators.website
  },
  
  login: {
    email: validators.email,
    password: (value) => validators.required(value, 'Password')
  },
  
  emailVerification: {
    otp: validators.otp
  },
  
  personalDetails: {
    fullName: validators.fullName,
    emiratesId: validators.emiratesId,
    dateOfBirth: (value) => validators.required(value, 'Date of birth'),
    nationality: (value) => validators.required(value, 'Nationality'),
    address: (value) => validators.required(value, 'Address')
  },
  
  passwordReset: {
    email: validators.email
  },
  
  setPassword: {
    newPassword: validators.password,
    confirmPassword: (value, formData) => {
      if (!value) return 'Please confirm your password';
      if (value !== formData.newPassword) return 'Passwords do not match';
      return null;
    }
  }
};
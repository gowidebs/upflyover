// Simple i18n utility for text constants
const texts = {
  en: {
    // Common
    search: 'Search',
    loading: 'Loading...',
    error: 'Error',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    clear: 'Clear',
    
    // Requirements
    requirements: 'Requirements',
    postRequirement: 'Post Requirement',
    browseRequirements: 'Browse Requirements',
    myRequirements: 'My Requirements',
    myApplications: 'My Applications',
    searchRequirements: 'Search Requirements',
    category: 'Category',
    location: 'Location',
    budget: 'Budget',
    anyBudget: 'Any Budget',
    allCategories: 'All Categories',
    activeFilters: 'Active Filters',
    found: 'Found',
    
    // Navigation
    dashboard: 'Dashboard',
    companies: 'Companies',
    messages: 'Messages',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    
    // Search
    searchCompanies: 'Search companies, requirements...',
    searchResults: 'Search Results',
    noResults: 'No results found',
    
    // Buttons
    apply: 'Apply',
    connect: 'Connect',
    viewProfile: 'View Profile',
    viewDetails: 'View Details',
    submitApplication: 'Submit Application'
  }
};

let currentLanguage = 'en';

export const t = (key) => {
  return texts[currentLanguage]?.[key] || key;
};

export const setLanguage = (lang) => {
  currentLanguage = lang;
};

export const getCurrentLanguage = () => currentLanguage;
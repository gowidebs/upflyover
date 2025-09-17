import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://upflyover-production-4d33.up.railway.app';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Initialize CSRF token
const initCSRF = async () => {
  try {
    if (!localStorage.getItem('csrfToken')) {
      const response = await axios.get(`${API_BASE_URL}/api/csrf-token`);
      localStorage.setItem('csrfToken', response.data.csrfToken);
    }
  } catch (error) {
    console.warn('Failed to initialize CSRF token:', error);
  }
};

// Initialize CSRF token on app start
initCSRF();

// Request interceptor to add auth token and CSRF token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF token for state-changing requests
    if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
      const csrfToken = localStorage.getItem('csrfToken') || 'csrf-token-placeholder';
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
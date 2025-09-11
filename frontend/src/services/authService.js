// Production-ready authentication service
class AuthService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'https://upflyover-production.up.railway.app/api';
    this.token = localStorage.getItem('token');
  }

  // Common headers for all requests
  getHeaders(includeAuth = false) {
    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest', // CSRF protection
    };
    
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic API call method with error handling
  async apiCall(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(options.auth),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return { success: true, data };
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      return { 
        success: false, 
        error: error.message || 'Network error occurred' 
      };
    }
  }

  // Individual Registration
  async registerIndividual(userData) {
    return this.apiCall('/auth/individual/register', {
      method: 'POST',
      body: JSON.stringify({
        ...userData,
        userType: 'individual'
      }),
    });
  }

  // Company Registration
  async registerCompany(companyData) {
    return this.apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        ...companyData,
        userType: 'company'
      }),
    });
  }

  // Unified Login
  async login(email, password) {
    const result = await this.apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.success && result.data.token) {
      this.token = result.data.token;
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
    }

    return result;
  }

  // Google OAuth Login
  async googleLogin(googleData) {
    const result = await this.apiCall('/auth/individual/register', {
      method: 'POST',
      body: JSON.stringify({
        email: googleData.email,
        password: 'google-oauth-' + googleData.sub,
        fullName: googleData.name,
        userType: 'individual',
        provider: 'google',
        googleId: googleData.sub,
        emailVerified: true
      }),
    });

    if (result.success && result.data.userId) {
      // For Google OAuth, we need to complete the flow
      return { 
        success: true, 
        requiresUserTypeSelection: true,
        userId: result.data.userId,
        email: googleData.email,
        provider: 'google'
      };
    }

    return result;
  }

  // Email Verification
  async verifyEmail(userId, otp) {
    return this.apiCall('/auth/individual/verify-email', {
      method: 'POST',
      body: JSON.stringify({ userId, otp }),
    });
  }

  // User Type Selection
  async selectUserType(userId, userType) {
    return this.apiCall('/auth/select-user-type', {
      method: 'POST',
      body: JSON.stringify({ userId, userType }),
    });
  }

  // Mobile Verification
  async verifyMobile(userId, phone) {
    return this.apiCall('/auth/individual/verify-mobile', {
      method: 'POST',
      body: JSON.stringify({ userId, phone }),
    });
  }

  // OTP Verification
  async verifyOTP(userId, phone, otp) {
    return this.apiCall('/auth/individual/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ userId, phone, otp }),
    });
  }

  // Personal Details
  async savePersonalDetails(userId, details) {
    return this.apiCall('/auth/individual/personal-details', {
      method: 'POST',
      body: JSON.stringify({ userId, ...details }),
    });
  }

  // Password Reset
  async requestPasswordReset(email) {
    return this.apiCall('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Set New Password
  async setNewPassword(email, token, newPassword) {
    return this.apiCall('/auth/set-password', {
      method: 'POST',
      body: JSON.stringify({ email, token, newPassword }),
    });
  }

  // Get User Profile
  async getProfile() {
    return this.apiCall('/auth/profile', {
      method: 'GET',
      auth: true,
    });
  }

  // Logout
  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.token;
  }

  // Get current user
  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }
}

export default new AuthService();
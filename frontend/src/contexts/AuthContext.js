import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'https://upflyover-production.up.railway.app';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null); // No longer using localStorage

  // Configure axios to send cookies with requests
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/auth/profile');
        setUser(response.data.company);
        setToken('authenticated'); // Set a flag to indicate authentication
      } catch (error) {
        // No valid cookie found, user not authenticated
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { company } = response.data;
      
      // Cookie is automatically set by the server
      setToken('authenticated');
      setUser(company);
      
      return { success: true, user: company };
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.requiresVerification) {
        return { 
          success: false, 
          error: errorData.error,
          requiresVerification: true,
          companyId: errorData.companyId
        };
      }
      return { success: false, error: errorData?.error || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      const { companyId, requiresVerification } = response.data;
      
      if (requiresVerification) {
        return { success: true, requiresVerification: true, companyId };
      } else {
        // Fallback for old flow - cookie is set by server
        const { company } = response.data;
        setToken('authenticated');
        setUser(company);
        return { success: true, user: company };
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setToken(null);
    setUser(null);
  };

  const verifyOTP = async (companyId, type, otp) => {
    try {
      const endpoint = type === 'email' ? '/auth/verify-email-otp' : '/auth/verify-phone-otp';
      const response = await axios.post(endpoint, { companyId, otp });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'OTP verification failed' };
    }
  };

  const completeVerification = async (companyId) => {
    try {
      const response = await axios.post('/auth/complete-verification', { companyId });
      const { company } = response.data;
      
      // Cookie is set by server
      setToken('authenticated');
      setUser(company);
      
      return { success: true, user: company };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Verification completion failed' };
    }
  };

  const resendOTP = async (companyId, type) => {
    try {
      const response = await axios.post('/auth/resend-otp', { companyId, type });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Failed to resend OTP' };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    verifyOTP,
    completeVerification,
    resendOTP,
    loading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
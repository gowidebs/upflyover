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
  const [token, setToken] = useState(localStorage.getItem('upflyover_token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/auth/profile');
          setUser(response.data.company);
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token: newToken, company } = response.data;
      
      localStorage.setItem('upflyover_token', newToken);
      setToken(newToken);
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
        // Fallback for old flow
        const { token: newToken, company } = response.data;
        localStorage.setItem('upflyover_token', newToken);
        setToken(newToken);
        setUser(company);
        return { success: true, user: company };
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('upflyover_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
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
      const { token: newToken, company } = response.data;
      
      localStorage.setItem('upflyover_token', newToken);
      setToken(newToken);
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
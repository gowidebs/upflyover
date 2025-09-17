import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import api from '../utils/api';

const WhiteLabelContext = createContext();

export const useWhiteLabel = () => {
  const context = useContext(WhiteLabelContext);
  if (!context) {
    throw new Error('useWhiteLabel must be used within WhiteLabelProvider');
  }
  return context;
};

export const WhiteLabelProvider = ({ children }) => {
  const [branding, setBranding] = useState({
    logo: '',
    primaryColor: '#1976d2',
    secondaryColor: '#42a5f5',
    companyName: 'Upflyover',
    favicon: ''
  });
  const [features, setFeatures] = useState({
    customDomain: false,
    sso: false,
    advancedSecurity: false,
    apiAccess: false,
    dedicatedSupport: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrandingConfig();
  }, []);

  const loadBrandingConfig = async () => {
    try {
      const domain = window.location.hostname;
      const response = await api.get(`/api/enterprise/branding/${domain}`);
      
      if (response.data.branding) {
        setBranding(response.data.branding);
      }
      
      if (response.data.features) {
        setFeatures(response.data.features);
      }
    } catch (error) {
      console.error('Failed to load branding config:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create dynamic theme based on branding
  const theme = createTheme({
    palette: {
      primary: {
        main: branding.primaryColor,
      },
      secondary: {
        main: branding.secondaryColor,
      },
    },
    typography: {
      h1: {
        fontFamily: branding.fontFamily || 'Roboto, sans-serif',
      },
      h2: {
        fontFamily: branding.fontFamily || 'Roboto, sans-serif',
      },
      h3: {
        fontFamily: branding.fontFamily || 'Roboto, sans-serif',
      },
      h4: {
        fontFamily: branding.fontFamily || 'Roboto, sans-serif',
      },
      h5: {
        fontFamily: branding.fontFamily || 'Roboto, sans-serif',
      },
      h6: {
        fontFamily: branding.fontFamily || 'Roboto, sans-serif',
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: branding.primaryColor,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          contained: {
            backgroundColor: branding.primaryColor,
            '&:hover': {
              backgroundColor: branding.secondaryColor,
            },
          },
        },
      },
    },
  });

  // Update favicon dynamically
  useEffect(() => {
    if (branding.favicon) {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = branding.favicon;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [branding.favicon]);

  // Update document title
  useEffect(() => {
    if (branding.companyName && branding.companyName !== 'Upflyover') {
      document.title = `${branding.companyName} - B2B Networking Platform`;
    }
  }, [branding.companyName]);

  const value = {
    branding,
    features,
    loading,
    setBranding,
    setFeatures,
    isWhiteLabeled: branding.companyName !== 'Upflyover'
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <WhiteLabelContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </WhiteLabelContext.Provider>
  );
};

// Custom Logo Component
export const BrandLogo = ({ sx = {} }) => {
  const { branding } = useWhiteLabel();
  
  if (branding.logo) {
    return (
      <img 
        src={branding.logo} 
        alt={branding.companyName}
        style={{ 
          height: 40, 
          width: 'auto',
          ...sx 
        }}
      />
    );
  }
  
  return (
    <div style={{ 
      fontSize: '1.5rem', 
      fontWeight: 'bold',
      color: branding.primaryColor,
      ...sx 
    }}>
      {branding.companyName}
    </div>
  );
};

// Feature Gate Component
export const FeatureGate = ({ feature, children, fallback = null }) => {
  const { features } = useWhiteLabel();
  
  if (features[feature]) {
    return children;
  }
  
  return fallback;
};

export default WhiteLabelProvider;
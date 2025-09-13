import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Requirements from './pages/Requirements';
import Companies from './pages/Companies';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import Explore from './pages/Explore';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import Help from './pages/Help';
import Security from './pages/Security';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import ApiDocs from './pages/ApiDocs';
import VerifyEmail from './pages/VerifyEmail';
import VerifyOTP from './pages/VerifyOTP';
import KYC from './pages/KYC';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminLogin from './pages/AdminLogin';
import AdminKYC from './pages/AdminKYC';
import KYCPending from './pages/KYCPending';
import CompanyProfile from './pages/CompanyProfile';
import SignupChoice from './pages/SignupChoice';
import IndividualSignup from './pages/IndividualSignup';
import UserTypeSelection from './pages/UserTypeSelection';
import IndividualVerification from './pages/IndividualVerification';
import IndividualEmailVerify from './pages/IndividualEmailVerify';
import PaymentSuccess from './pages/PaymentSuccess';
import CompanyDetails from './pages/CompanyDetails';
import Notifications from './pages/Notifications';
import Search from './pages/Search';
import { AuthProvider } from './contexts/AuthContext';
import Footer from './components/Footer';

// Upflyover brand theme
const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(30, 86, 86)', // Upflyover Green
      light: 'rgb(50, 106, 106)',
      dark: 'rgb(20, 66, 66)'
    },
    secondary: {
      main: '#FFFFFF', // White
      light: '#FFFFFF',
      dark: '#F5F5F5'
    },
    background: {
      default: '#FFFFFF', // White
      paper: '#FFFFFF'
    },
    success: {
      main: 'rgb(30, 86, 86)' // Same green
    },
    text: {
      primary: '#000000', // Black
      secondary: '#333333'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem'
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem'
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem'
    }
  },
  shape: {
    borderRadius: 12
  }
});

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id"}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup-choice" element={<SignupChoice />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/signup/individual" element={<IndividualSignup />} />

              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/verify-individual-email" element={<IndividualEmailVerify />} />
              <Route path="/user-type-selection" element={<UserTypeSelection />} />
              <Route path="/individual-verification" element={<IndividualVerification />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/kyc" element={<KYC />} />
              <Route path="/kyc-pending" element={<KYCPending />} />
              <Route path="/profile" element={<CompanyProfile />} />
              <Route path="/requirements" element={<Requirements />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/kyc" element={<AdminKYC />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/companies/:id" element={<CompanyDetails />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/search" element={<Search />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/help" element={<Help />} />
              <Route path="/security" element={<Security />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/api-docs" element={<ApiDocs />} />
            </Routes>
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
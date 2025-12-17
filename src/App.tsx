import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AnimatedPage from './components/animations/AnimatedPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WelcomeModal from './components/WelcomeModal';
import Home from './pages/Home';
import About from './pages/About';
import Agents from './pages/Agents';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import AuthCallback from './pages/AuthCallback';

function AppContent() {
  const location = useLocation();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // Show welcome modal only on home page and only once per session
    const hasSeenModal = sessionStorage.getItem('hasSeenWelcomeModal');
    if (location.pathname === '/' && !hasSeenModal) {
      const timer = setTimeout(() => {
        setShowWelcomeModal(true);
      }, 1500); // Show after 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const handleCloseModal = () => {
    setShowWelcomeModal(false);
    sessionStorage.setItem('hasSeenWelcomeModal', 'true');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16 page-transition">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
            <Route path="/agents" element={<AnimatedPage><Agents /></AnimatedPage>} />
            <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
            <Route path="/terms" element={<AnimatedPage><Terms /></AnimatedPage>} />
            <Route path="/privacy" element={<AnimatedPage><Privacy /></AnimatedPage>} />
            <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />

      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={handleCloseModal}
      />
    </div>
  );
}

const App: React.FC = () => {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;

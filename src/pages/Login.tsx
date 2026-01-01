import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { login, loginWithEmail, register, isAuthenticated } = useAuth();
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Login
        const success = await loginWithEmail(formData.email, formData.password);
        if (success) {
          navigate('/dashboard');
        } else {
          setError('Invalid email or password');
        }
      } else {
        // Signup - AuthContext will show specific error via alert
        const success = await register(formData.email, formData.password, formData.name);
        if (success) {
          setError('');
          alert('Registration successful! Please check your email to verify your account, then log in.');
          setIsLogin(true);
          setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        }
        // Don't show generic error - AuthContext shows specific error
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await login(null); // Supabase OAuth doesn't need credential
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-24">
      <div className="max-w-md w-full mx-auto px-4">
        <Card variant="premium" className="p-10 hover-glow">
          <div className="text-center mb-10">
            <img
              src="/logo1111.jpg"
              alt="Vidvas AI"
              className="w-20 h-20 rounded-2xl mx-auto mb-6 shadow-glow-teal animate-float object-cover"
            />
            <h1 className="text-4xl md:text-5xl font-bold font-inter mb-4 text-gradient-animate">
              {isLogin ? 'Welcome Back' : 'Join VIDVAS AI'}
            </h1>
            <p className="text-gray-300 text-lg font-inter">
              {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 mb-8 p-1 glass-premium rounded-xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold font-inter transition-all duration-200 ${isLogin
                ? 'bg-gradient-to-r from-cyber-aqua to-cyber-aqua text-white shadow-glow-md'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold font-inter transition-all duration-200 ${!isLogin
                ? 'bg-gradient-to-r from-cyber-aqua to-cyber-aqua text-white shadow-glow-md'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* Google Auth Button */}
          <div className="w-full mb-6">
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-3"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-medium-gray"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 glass-premium text-gray-400 font-inter">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full px-4 py-3 glass-premium border border-light-gray/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-aqua focus:border-transparent transition-all duration-200 font-inter"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 glass-premium border border-light-gray/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-aqua focus:border-transparent transition-all duration-200 font-inter"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 glass-premium border border-light-gray/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-aqua focus:border-transparent transition-all duration-200 font-inter"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="p-4 glass-premium border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm font-inter">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full shadow-glow-teal"
            >
              {isLogin ? 'Sign In 🚀' : 'Create Account 🚀'}
            </Button>
          </form>

          {!isLogin && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400 font-inter">
                By creating an account, you agree to our{' '}
                <a href="/terms" className="text-cyber-aqua hover:text-cyber-aqua transition-colors">
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-cyber-aqua hover:text-cyber-aqua transition-colors">
                  Privacy Policy
                </a>
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Login;



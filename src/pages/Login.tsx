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
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const success = await loginWithEmail(formData.email, formData.password);
        if (success) {
          navigate('/dashboard', { replace: true });
        } else {
          setError('Invalid email or password. Please try again.');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters.');
          return;
        }
        const result = await register(formData.email, formData.password, formData.name);
        if (result.success) {
          if (result.emailConfirmationRequired) {
            setSuccessMessage('Account created! Check your email to verify your account, then sign in.');
            setIsLogin(true);
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
          } else {
            navigate('/dashboard', { replace: true });
          }
        } else {
          setError(result.error || 'Registration failed. Please try again.');
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen flex items-center justify-center py-24 bg-atmospheric-mesh">
      <div className="max-w-md w-full mx-auto px-4">
        <Card variant="premium" className="p-12 hover-lift shadow-dramatic glass-editorial">
          <div className="text-center mb-12">
            <img
              src="/logo1111.jpg"
              alt="Vidvas AI"
              className="w-24 h-24 rounded-3xl mx-auto mb-8 shadow-atmospheric animate-float object-cover"
            />
            <h1 className="text-5xl md:text-6xl font-display font-black mb-6 text-gradient-editorial">
              {isLogin ? 'Welcome Back' : 'Join VIDVAS AI'}
            </h1>
            <p className="text-ink/80 text-lg font-body">
              {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
            </p>
          </div>

          {/* Tab Switcher - Editorial */}
          <div className="flex gap-3 mb-10 p-2 glass-editorial rounded-2xl border-2 border-electric-amber/20">
            <button
              onClick={() => { setIsLogin(true); setError(''); setSuccessMessage(''); }}
              className={`flex-1 py-4 px-6 rounded-xl font-bold font-body transition-all duration-300 ${isLogin
                ? 'bg-gradient-to-r from-electric-amber to-retro-orange text-deep-black shadow-atmospheric'
                : 'text-ink/60 hover:text-ink'
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccessMessage(''); }}
              className={`flex-1 py-4 px-6 rounded-xl font-bold font-body transition-all duration-300 ${!isLogin
                ? 'bg-gradient-to-r from-deep-cyan to-vintage-magenta text-white shadow-atmospheric'
                : 'text-ink/60 hover:text-ink'
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* Google Auth Button */}
          <div className="w-full mb-8">
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-3 hover-lift border-2 border-electric-amber/30"
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

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-electric-amber/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 glass-editorial text-ink/60 font-body font-semibold">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form - Brutalist */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-ink/90 mb-3 font-body uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full px-5 py-4 glass-editorial border-2 border-electric-amber/30 rounded-2xl text-ink placeholder-ink-3/40 focus:outline-none focus:ring-2 focus:ring-electric-amber focus:border-electric-amber transition-all duration-300 font-body"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-ink/90 mb-3 font-body uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-5 py-4 glass-editorial border-2 border-deep-cyan/30 rounded-2xl text-ink placeholder-ink-3/40 focus:outline-none focus:ring-2 focus:ring-deep-cyan focus:border-deep-cyan transition-all duration-300 font-body"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-ink/90 mb-3 font-body uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-5 py-4 glass-editorial border-2 border-vintage-magenta/30 rounded-2xl text-ink placeholder-ink-3/40 focus:outline-none focus:ring-2 focus:ring-vintage-magenta focus:border-vintage-magenta transition-all duration-300 font-body"
                placeholder="Enter your password"
              />
            </div>

            {successMessage && (
              <div className="p-4 glass-premium border border-neon-green/30 rounded-xl">
                <p className="text-neon-green text-sm font-inter">✓ {successMessage}</p>
              </div>
            )}

            {error && (
              <div className="p-4 glass-premium border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm font-inter">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full shadow-atmospheric hover-lift"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Please wait...' : isLogin ? 'Sign In 🚀' : 'Create Account 🚀'}
            </Button>
          </form>

          {!isLogin && (
            <div className="mt-8 text-center">
              <p className="text-xs text-ink/60 font-body">
                By creating an account, you agree to our{' '}
                <a href="/terms" className="text-electric-amber hover:text-deep-cyan transition-colors font-semibold">
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-electric-amber hover:text-deep-cyan transition-colors font-semibold">
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



import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  subscription: 'free' | 'pro' | 'enterprise';
  aiAgents: {
    id: string;
    name: string;
    status: 'active' | 'inactive';
    deployedAt: string;
  }[];
  services: {
    id: string;
    name: string;
    type: string;
    status: 'active' | 'paused';
    usage: number;
  }[];
}

export interface RegisterResult {
  success: boolean;
  emailConfirmationRequired: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credential: any) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<RegisterResult>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Convert Supabase user to our User type
  const convertSupabaseUser = (supabaseUser: SupabaseUser, profile?: any): User => {
    return {
      id: supabaseUser.id,
      name: profile?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      picture: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.email || 'User')}&background=667EEA&color=fff`,
      subscription: 'free',
      aiAgents: [],
      services: []
    };
  };

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('users_profile')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser(convertSupabaseUser(session.user, profile));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users_profile')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setUser(convertSupabaseUser(session.user, profile));
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Google OAuth login - Use Supabase OAuth flow
  const login = async (credential: any) => {
    try {
      // For Supabase, we should use signInWithOAuth instead
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Email/Password login
  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      return !!data.user;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Email/Password registration
  const register = async (email: string, password: string, name: string): Promise<RegisterResult> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });

      if (error) {
        return { success: false, emailConfirmationRequired: false, error: error.message };
      }

      if (data.user) {
        await supabase.from('users_profile').insert({
          id: data.user.id,
          full_name: name,
          updated_at: new Date().toISOString()
        });
      }

      // If session is null, Supabase requires email confirmation
      const emailConfirmationRequired = !data.session;
      return { success: true, emailConfirmationRequired };
    } catch (error: any) {
      return { success: false, emailConfirmationRequired: false, error: error.message || 'Registration failed' };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Update user data
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    loginWithEmail,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



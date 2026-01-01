import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * Component to handle OAuth callback redirects
 * Place this in your App.tsx routes
 */
export const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Handle the OAuth callback
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                // User is authenticated, redirect to dashboard
                navigate('/dashboard', { replace: true });
            } else {
                // No session, redirect to login
                navigate('/login', { replace: true });
            }
        });
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-cyber-aqua border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-300 font-inter">Completing sign in...</p>
            </div>
        </div>
    );
};

export default AuthCallback;



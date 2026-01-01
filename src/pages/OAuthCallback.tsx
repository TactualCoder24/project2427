import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleOAuthCallback } from '../lib/oauthService';

const OAuthCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [message, setMessage] = useState('Connecting your account...');

    useEffect(() => {
        const processCallback = async () => {
            try {
                // Get authorization code from URL
                const code = searchParams.get('code');
                const error = searchParams.get('error');

                // Get provider from URL path
                const pathParts = window.location.pathname.split('/');
                const provider = pathParts[pathParts.length - 1];

                // Check for errors
                if (error) {
                    throw new Error(searchParams.get('error_description') || error);
                }

                if (!code) {
                    throw new Error('No authorization code received');
                }

                if (!provider || !['gmail', 'slack', 'github'].includes(provider)) {
                    throw new Error('Invalid provider');
                }

                // Update status
                setMessage(`Connecting to ${provider.charAt(0).toUpperCase() + provider.slice(1)}...`);

                // Exchange code for tokens
                await handleOAuthCallback(provider, code);

                // Success!
                setStatus('success');
                setMessage(`Successfully connected ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`);

                // Redirect to integrations page after 2 seconds
                setTimeout(() => {
                    navigate('/integrations');
                }, 2000);

            } catch (error) {
                console.error('OAuth callback error:', error);
                setStatus('error');
                setMessage(error instanceof Error ? error.message : 'Connection failed');

                // Redirect back to integrations after 3 seconds
                setTimeout(() => {
                    navigate('/integrations');
                }, 3000);
            }
        };

        processCallback();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="text-center max-w-md px-6">
                {/* Loading Spinner */}
                {status === 'processing' && (
                    <div className="mb-6">
                        <div className="w-20 h-20 border-4 border-cyber-aqua border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                )}

                {/* Success Icon */}
                {status === 'success' && (
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-neon-green to-lime-green rounded-full flex items-center justify-center mx-auto shadow-glow-md animate-scaleIn">
                            <span className="text-5xl text-white">✓</span>
                        </div>
                    </div>
                )}

                {/* Error Icon */}
                {status === 'error' && (
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto animate-scaleIn">
                            <span className="text-5xl text-white">✗</span>
                        </div>
                    </div>
                )}

                {/* Message */}
                <h2 className={`text-2xl font-bold font-inter mb-3 ${status === 'success' ? 'text-gradient' :
                        status === 'error' ? 'text-red-400' :
                            'text-white'
                    }`}>
                    {status === 'processing' && 'Connecting...'}
                    {status === 'success' && 'Connected!'}
                    {status === 'error' && 'Connection Failed'}
                </h2>

                <p className={`text-lg font-inter ${status === 'success' ? 'text-neon-green' :
                        status === 'error' ? 'text-red-400' :
                            'text-gray-300'
                    }`}>
                    {message}
                </p>

                {/* Additional info */}
                {status === 'success' && (
                    <p className="text-sm text-gray-400 mt-4 font-inter">
                        Redirecting to Integration Hub...
                    </p>
                )}

                {status === 'error' && (
                    <p className="text-sm text-gray-400 mt-4 font-inter">
                        Redirecting back to Integration Hub...
                    </p>
                )}
            </div>
        </div>
    );
};

export default OAuthCallback;



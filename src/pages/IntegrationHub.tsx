import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { initiateOAuth, isConnected } from '../lib/oauthService';
import { agentIntegrationService } from '../lib/supabaseAgentService';

interface Integration {
    id: string;
    name: string;
    icon: string;
    description: string;
    category: string;
    status: 'connected' | 'disconnected';
    scopes?: string[];
    connectedAt?: Date;
}

const IntegrationHub: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [integrations, setIntegrations] = useState<Integration[]>([
        {
            id: 'gmail',
            name: 'Gmail',
            icon: '📧',
            description: 'Send and manage emails, read inbox, search messages',
            category: 'Communication',
            status: 'disconnected'
        },
        {
            id: 'slack',
            name: 'Slack',
            icon: '💬',
            description: 'Post messages, create channels, manage team communication',
            category: 'Communication',
            status: 'disconnected'
        },
        {
            id: 'notion',
            name: 'Notion',
            icon: '📝',
            description: 'Create pages, update databases, manage knowledge base',
            category: 'Productivity',
            status: 'disconnected'
        },
        {
            id: 'github',
            name: 'GitHub',
            icon: '🐙',
            description: 'Manage repositories, create issues, handle pull requests',
            category: 'Development',
            status: 'disconnected'
        },
        {
            id: 'google-calendar',
            name: 'Google Calendar',
            icon: '📅',
            description: 'Schedule meetings, manage events, check availability',
            category: 'Productivity',
            status: 'disconnected'
        },
        {
            id: 'google-drive',
            name: 'Google Drive',
            icon: '📁',
            description: 'Upload files, manage documents, share resources',
            category: 'Storage',
            status: 'disconnected'
        },
        {
            id: 'trello',
            name: 'Trello',
            icon: '📋',
            description: 'Create boards, manage cards, track project progress',
            category: 'Productivity',
            status: 'disconnected'
        },
        {
            id: 'linkedin',
            name: 'LinkedIn',
            icon: '💼',
            description: 'Manage connections, post updates, track engagement',
            category: 'Social',
            status: 'disconnected'
        },
        {
            id: 'twitter',
            name: 'Twitter/X',
            icon: '🐦',
            description: 'Post tweets, manage timeline, track mentions',
            category: 'Social',
            status: 'disconnected'
        },
        {
            id: 'stripe',
            name: 'Stripe',
            icon: '💳',
            description: 'Process payments, manage invoices, track transactions',
            category: 'Finance',
            status: 'disconnected'
        },
        {
            id: 'shopify',
            name: 'Shopify',
            icon: '🛍️',
            description: 'Manage products, process orders, track inventory',
            category: 'E-commerce',
            status: 'disconnected'
        },
        {
            id: 'hubspot',
            name: 'HubSpot',
            icon: '🎯',
            description: 'Manage CRM, track leads, automate marketing',
            category: 'Sales',
            status: 'disconnected'
        }
    ]);

    const categories = ['All', ...Array.from(new Set(integrations.map(i => i.category)))];
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredIntegrations = integrations.filter(
        i => selectedCategory === 'All' || i.category === selectedCategory
    );

    // Load connection status from database
    useEffect(() => {
        const loadConnectionStatus = async () => {
            if (!user) return;

            try {
                const allIntegrations = await agentIntegrationService.getAll();

                setIntegrations(prev => prev.map(integration => {
                    const dbIntegration = allIntegrations.find(
                        i => i.integration_name === integration.id
                    );

                    return {
                        ...integration,
                        status: dbIntegration?.status === 'connected' ? 'connected' : 'disconnected',
                        connectedAt: dbIntegration?.connected_at ? new Date(dbIntegration.connected_at) : undefined
                    };
                }));
            } catch (error) {
                console.error('Failed to load integration status:', error);
            }
        };

        loadConnectionStatus();
    }, [user]);

    const handleConnect = async (integrationId: string) => {
        try {
            // Special handling for Notion (uses Internal Integration)
            if (integrationId === 'notion') {
                alert(
                    'Notion Integration Setup:\n\n' +
                    '1. The Notion integration is already configured\n' +
                    '2. Go to your Notion workspace\n' +
                    '3. Share the pages you want to access with "Vidvas AI" integration\n' +
                    '4. The integration will then have access to those pages'
                );

                // Mark as connected in database
                await agentIntegrationService.upsert({
                    integration_name: 'notion',
                    integration_type: 'internal',
                    access_token: process.env.REACT_APP_NOTION_API_KEY || '',
                    scopes: ['read', 'write'],
                    metadata: {},
                    status: 'connected',
                    connected_at: new Date().toISOString()
                });

                // Update UI
                setIntegrations(prev => prev.map(i =>
                    i.id === 'notion' ? { ...i, status: 'connected', connectedAt: new Date() } : i
                ));

                return;
            }

            // For OAuth providers (Gmail, Slack, GitHub)
            if (['gmail', 'slack', 'github'].includes(integrationId)) {
                initiateOAuth(integrationId);
            } else {
                alert(`${integrationId} integration coming soon!`);
            }
        } catch (error) {
            console.error('Connection failed:', error);
            alert(`Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleDisconnect = (integrationId: string) => {
        setIntegrations(prev =>
            prev.map(i =>
                i.id === integrationId ? { ...i, status: 'disconnected' as const, connectedAt: undefined } : i
            )
        );
    };

    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-300 font-inter">Loading...</p>
                </div>
            </div>
        );
    }

    const connectedCount = integrations.filter(i => i.status === 'connected').length;

    return (
        <div className="min-h-screen py-20 bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-inter mb-6">
                        Integration <span className="text-gradient-animate">Hub</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-inter leading-relaxed">
                        Connect your favorite apps and services to unlock the full power of agentic AI automation.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card variant="gradient" className="p-6 hover-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-inter mb-2">Connected Apps</p>
                                <p className="text-4xl font-bold font-inter text-gradient-cyber">
                                    {connectedCount}
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-neon-green to-lime-green rounded-2xl flex items-center justify-center shadow-glow-sm">
                                <span className="text-3xl">✓</span>
                            </div>
                        </div>
                    </Card>

                    <Card variant="gradient" className="p-6 hover-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-inter mb-2">Available Integrations</p>
                                <p className="text-4xl font-bold font-inter text-gradient">
                                    {integrations.length}
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-electric-blue to-vivid-purple rounded-2xl flex items-center justify-center shadow-glow-md">
                                <span className="text-3xl">🔌</span>
                            </div>
                        </div>
                    </Card>

                    <Card variant="gradient" className="p-6 hover-glow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-300 text-sm font-inter mb-2">Categories</p>
                                <p className="text-4xl font-bold font-inter text-gradient-electric">
                                    {categories.length - 1}
                                </p>
                            </div>
                            <div className="w-16 h-16 bg-gradient-to-br from-vivid-purple to-hot-pink rounded-2xl flex items-center justify-center shadow-glow-purple">
                                <span className="text-3xl">📦</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-3 rounded-full transition-all duration-300 font-sora font-semibold text-base ${selectedCategory === category
                                ? 'bg-gradient-to-r from-electric-blue to-vivid-purple text-white shadow-glow-md scale-105'
                                : 'glass-premium text-gray-300 hover:text-white hover:border-electric-blue/50'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Integrations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredIntegrations.map((integration) => (
                        <Card key={integration.id} variant="premium" className="p-6 hover-glow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-electric-blue via-vivid-purple to-hot-pink rounded-xl flex items-center justify-center shadow-glow-purple">
                                    <span className="text-3xl">{integration.icon}</span>
                                </div>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${integration.status === 'connected'
                                        ? 'bg-neon-green/20 text-neon-green'
                                        : 'bg-gray-500/20 text-gray-400'
                                        }`}
                                >
                                    {integration.status === 'connected' ? '✓ Connected' : 'Not Connected'}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold font-inter mb-2 text-gradient-cyber">
                                {integration.name}
                            </h3>

                            <p className="text-sm text-gray-400 mb-1 font-inter">
                                {integration.category}
                            </p>

                            <p className="text-gray-300 mb-4 font-inter leading-relaxed">
                                {integration.description}
                            </p>

                            {integration.status === 'connected' ? (
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-400 font-inter">
                                        Connected {integration.connectedAt?.toLocaleDateString() || 'recently'}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleDisconnect(integration.id)}
                                        >
                                            Disconnect
                                        </Button>
                                        <Button variant="gradient" size="sm" className="flex-1">
                                            Test
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    variant="gradient"
                                    className="w-full"
                                    onClick={() => handleConnect(integration.id)}
                                >
                                    Connect →
                                </Button>
                            )}
                        </Card>
                    ))}
                </div>

                {/* CTA */}
                <Card variant="gradient" className="mt-16 p-12 text-center hover-glow">
                    <h2 className="text-4xl md:text-5xl font-bold font-inter mb-6 text-gradient-electric">
                        Need a Custom Integration?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-inter leading-relaxed">
                        We can build custom integrations for your specific needs. Contact our team to discuss your requirements.
                    </p>
                    <Button variant="gradient-purple" size="xl" onClick={() => navigate('/contact')}>
                        Contact Sales →
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default IntegrationHub;


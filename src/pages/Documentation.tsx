import React from 'react';

const Documentation: React.FC = () => {
    const docs = [
        {
            title: 'Getting Started',
            icon: '🚀',
            items: [
                { name: 'Quick Start Guide', desc: 'Get up and running in 5 minutes' },
                { name: 'Creating Your First Agent', desc: 'Step-by-step tutorial' },
                { name: 'Setting Up Integrations', desc: 'Connect Gmail, Slack, and more' }
            ]
        },
        {
            title: 'Core Concepts',
            icon: '📚',
            items: [
                { name: 'AI Agents', desc: 'Understanding intelligent automation' },
                { name: 'Workflows', desc: 'Building automated processes' },
                { name: 'Personas', desc: 'Customizing agent behavior' }
            ]
        },
        {
            title: 'Integrations',
            icon: '🔌',
            items: [
                { name: 'Gmail Integration', desc: 'Automate email workflows' },
                { name: 'Slack Integration', desc: 'Connect team communication' },
                { name: 'GitHub Integration', desc: 'Automate development tasks' }
            ]
        },
        {
            title: 'Advanced Features',
            icon: '⚡',
            items: [
                { name: 'Custom AI Training', desc: 'Train agents for specific tasks' },
                { name: 'API Documentation', desc: 'Integrate with your systems' },
                { name: 'Workflow Templates', desc: 'Pre-built automation recipes' }
            ]
        }
    ];

    return (
        <div className="min-h-screen pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block px-6 py-3 glass-premium rounded-full text-sm font-bold mb-8 border border-intelligence-blue/30">
                        <span className="text-gradient-intelligence">📖 Documentation</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold font-inter mb-6">
                        <span className="text-gradient-intelligence">Learn</span>{' '}
                        <span className="text-white">VIDVAS AI</span>
                    </h1>

                    <p className="text-xl text-gray-400 font-inter max-w-3xl mx-auto">
                        Comprehensive guides and documentation to help you get the most out of our platform
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-16">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search documentation..."
                            className="w-full px-6 py-4 pl-12 glass-premium border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-intelligence-blue focus:border-transparent font-inter"
                        />
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Documentation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {docs.map((section, idx) => (
                        <div key={idx} className="glass-premium rounded-2xl p-8 border border-white/10 hover:border-intelligence-blue/30 transition-all">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-4xl">{section.icon}</span>
                                <h2 className="text-2xl font-bold text-white font-inter">{section.title}</h2>
                            </div>

                            <div className="space-y-4">
                                {section.items.map((item, itemIdx) => (
                                    <a
                                        key={itemIdx}
                                        href="#"
                                        className="block p-4 glass-premium rounded-xl border border-white/5 hover:border-intelligence-blue/30 transition-all group"
                                    >
                                        <h3 className="text-lg font-semibold text-white mb-1 font-inter group-hover:text-gradient-intelligence transition-all">
                                            {item.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm font-inter">{item.desc}</p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Links */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: '🎥', title: 'Video Tutorials', desc: 'Watch step-by-step guides' },
                        { icon: '💬', title: 'Community Forum', desc: 'Connect with other users' },
                        { icon: '🛠️', title: 'API Reference', desc: 'Technical documentation' }
                    ].map((item, idx) => (
                        <div key={idx} className="glass-premium rounded-xl p-6 border border-white/10 text-center hover:border-intelligence-blue/30 transition-all">
                            <div className="text-4xl mb-3">{item.icon}</div>
                            <h3 className="text-lg font-bold text-white mb-2 font-inter">{item.title}</h3>
                            <p className="text-gray-400 text-sm font-inter">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Documentation;

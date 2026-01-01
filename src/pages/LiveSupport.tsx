import React, { useState } from 'react';

const LiveSupport: React.FC = () => {
    const [message, setMessage] = useState('');
    const [chatStarted, setChatStarted] = useState(false);

    const handleStartChat = () => {
        setChatStarted(true);
    };

    return (
        <div className="min-h-screen pt-20 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-block px-6 py-3 glass-premium rounded-full text-sm font-bold mb-8 border border-intelligence-blue/30">
                        <span className="text-gradient-intelligence">💬 Live Chat Support</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold font-inter mb-6">
                        <span className="text-gradient-intelligence">Get Help</span>
                        <br />
                        <span className="text-white">Instantly</span>
                    </h1>

                    <p className="text-xl text-gray-400 font-inter">
                        Our support team is available 24/7 to assist you
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Chat Window */}
                    <div className="lg:col-span-2">
                        <div className="glass-premium rounded-2xl border border-white/10 overflow-hidden">
                            {/* Chat Header */}
                            <div className="bg-gradient-intelligence p-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <span className="text-2xl">🤖</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white font-inter">VIDVAS Support</h3>
                                    <p className="text-xs text-white/80 font-inter">Online • Avg response: 2 min</p>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="h-96 p-6 overflow-y-auto bg-dark-gray/50">
                                {!chatStarted ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <div className="text-6xl mb-4">👋</div>
                                        <h3 className="text-2xl font-bold text-white mb-2 font-inter">Welcome to VIDVAS Support!</h3>
                                        <p className="text-gray-400 mb-6 font-inter">How can we help you today?</p>
                                        <button
                                            onClick={handleStartChat}
                                            className="bg-gradient-intelligence text-white px-8 py-3 rounded-xl font-bold shadow-glow-blue hover:shadow-glow-teal transition-all font-inter"
                                        >
                                            Start Chat
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-intelligence-blue/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm">🤖</span>
                                            </div>
                                            <div className="glass-premium p-4 rounded-xl border border-white/10 max-w-md">
                                                <p className="text-white font-inter">Hi! I'm here to help. What can I assist you with today?</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 border-t border-white/10">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 px-4 py-3 glass-premium border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-intelligence-blue font-inter"
                                        disabled={!chatStarted}
                                    />
                                    <button
                                        disabled={!chatStarted || !message.trim()}
                                        className="bg-gradient-intelligence text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow-blue transition-all font-inter"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Support Info */}
                    <div className="space-y-6">
                        <div className="glass-premium rounded-xl p-6 border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4 font-inter">Support Hours</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-signal-green"></span>
                                    <span className="text-gray-300 font-inter">24/7 Live Chat</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-signal-green"></span>
                                    <span className="text-gray-300 font-inter">Email Support</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-cyber-aqua"></span>
                                    <span className="text-gray-300 font-inter">Phone (Mon-Fri, 9AM-6PM IST)</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-premium rounded-xl p-6 border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4 font-inter">Quick Actions</h3>
                            <div className="space-y-3">
                                <a href="/faq" className="block p-3 glass-premium rounded-lg border border-white/5 hover:border-intelligence-blue/30 transition-all">
                                    <p className="text-white font-semibold font-inter">📖 View FAQ</p>
                                </a>
                                <a href="/docs" className="block p-3 glass-premium rounded-lg border border-white/5 hover:border-intelligence-blue/30 transition-all">
                                    <p className="text-white font-semibold font-inter">📚 Documentation</p>
                                </a>
                                <a href="/demo" className="block p-3 glass-premium rounded-lg border border-white/5 hover:border-intelligence-blue/30 transition-all">
                                    <p className="text-white font-semibold font-inter">📅 Schedule Demo</p>
                                </a>
                            </div>
                        </div>

                        <div className="glass-premium rounded-xl p-6 border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4 font-inter">Contact Info</h3>
                            <div className="space-y-3 text-sm">
                                <p className="text-gray-300 font-inter">📧 support@vidvasai.com</p>
                                <p className="text-gray-300 font-inter">📞 +91 98765 43210</p>
                                <p className="text-gray-300 font-inter">📍 Delhi, India 🇮🇳</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveSupport;

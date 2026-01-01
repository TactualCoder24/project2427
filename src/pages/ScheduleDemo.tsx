import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ScheduleDemo: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        employees: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Demo request submitted! Our team will contact you within 24 hours.');
        navigate('/');
    };

    return (
        <div className="min-h-screen pt-20 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-block px-6 py-3 glass-premium rounded-full text-sm font-bold mb-8 border border-intelligence-blue/30">
                        <span className="text-gradient-intelligence">📅 Schedule a Demo</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold font-inter mb-6">
                        <span className="text-gradient-intelligence">See VIDVAS AI</span>
                        <br />
                        <span className="text-white">in Action</span>
                    </h1>

                    <p className="text-xl text-gray-400 font-inter">
                        Book a personalized demo with our team and discover how AI can transform your workflow
                    </p>
                </div>

                {/* Form */}
                <div className="glass-premium rounded-2xl p-8 border border-white/10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2 font-inter">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 glass-premium border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-intelligence-blue focus:border-transparent font-inter"
                                    placeholder="Rajesh Kumar"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2 font-inter">Work Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 glass-premium border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-intelligence-blue focus:border-transparent font-inter"
                                    placeholder="rajesh@company.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2 font-inter">Company Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    className="w-full px-4 py-3 glass-premium border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-intelligence-blue focus:border-transparent font-inter"
                                    placeholder="Your Company"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2 font-inter">Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 glass-premium border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-intelligence-blue focus:border-transparent font-inter"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2 font-inter">Company Size</label>
                            <select
                                value={formData.employees}
                                onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                                className="w-full px-4 py-3 glass-premium border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-intelligence-blue focus:border-transparent font-inter"
                            >
                                <option value="">Select company size</option>
                                <option value="1-10">1-10 employees</option>
                                <option value="11-50">11-50 employees</option>
                                <option value="51-200">51-200 employees</option>
                                <option value="201-500">201-500 employees</option>
                                <option value="500+">500+ employees</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-300 mb-2 font-inter">What would you like to discuss?</label>
                            <textarea
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-4 py-3 glass-premium border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-intelligence-blue focus:border-transparent resize-none font-inter"
                                placeholder="Tell us about your automation needs..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-intelligence text-white px-8 py-4 rounded-xl font-bold text-lg shadow-glow-blue hover:shadow-glow-teal transition-all duration-300 font-inter"
                        >
                            Schedule My Demo
                        </button>
                    </form>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    {[
                        { icon: '⚡', title: '30-Min Session', desc: 'Quick and focused demo' },
                        { icon: '🎯', title: 'Personalized', desc: 'Tailored to your needs' },
                        { icon: '💡', title: 'Expert Guidance', desc: 'Direct from our team' }
                    ].map((item, idx) => (
                        <div key={idx} className="glass-premium rounded-xl p-6 border border-white/10 text-center">
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

export default ScheduleDemo;

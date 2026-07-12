import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const ScheduleDemo: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        employees: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        try {
            const { error } = await supabase
                .from('demo_requests')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    company: formData.company || null,
                    phone: formData.phone || null,
                    employees: formData.employees || null,
                    message: formData.message || null,
                }]);

            if (error) throw error;

            setSubmitStatus('success');
            setFormData({ name: '', email: '', company: '', phone: '', employees: '', message: '' });
        } catch (err: any) {
            console.error('Demo request error:', err);
            setSubmitStatus('error');
            setErrorMessage(err.message || 'Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitStatus === 'success') {
        return (
            <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
                <div className="max-w-lg mx-auto text-center px-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-electric-blue to-neon-green rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow-md animate-bounce-subtle">
                        <span className="text-4xl">🎉</span>
                    </div>
                    <h2 className="text-4xl font-bold font-outfit text-ink mb-4">Demo Requested!</h2>
                    <p className="text-ink-2 font-jakarta mb-2">
                        Thanks <strong className="text-ink">{formData.name || 'there'}</strong> — we've received your request.
                    </p>
                    <p className="text-ink-2 font-jakarta mb-8">
                        Our team will reach out to <strong className="text-neon-blue">{formData.email}</strong> within 24 hours to confirm a time.
                    </p>
                    <button
                        onClick={() => setSubmitStatus('idle')}
                        className="text-sm text-ink-3 hover:text-ink transition-colors font-jakarta"
                    >
                        ← Submit another request
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-gradient-cyber text-sm font-inter font-bold tracking-widest uppercase mb-5">Live Demo</p>
                    <h1 className="text-5xl md:text-6xl font-bold font-outfit text-ink mb-4">
                        See VIDVAS AI in Action
                    </h1>
                    <p className="text-xl text-ink-2 font-jakarta">
                        Book a personalized 30-minute demo with our team.
                    </p>
                </div>

                {/* Error banner */}
                {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-jakarta text-sm">
                        ⚠️ {errorMessage}
                    </div>
                )}

                {/* Form */}
                <div className="bg-gray-900/60 border border-edge rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-ink-2 mb-2 font-inter">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-edge rounded-xl text-ink placeholder-ink-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue focus:border-electric-blue/50 transition-colors font-inter"
                                    placeholder="Rajesh Kumar"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-ink-2 mb-2 font-inter">Work Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-edge rounded-xl text-ink placeholder-ink-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue focus:border-electric-blue/50 transition-colors font-inter"
                                    placeholder="rajesh@company.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-ink-2 mb-2 font-inter">Company Name *</label>
                                <input
                                    type="text"
                                    name="company"
                                    required
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-edge rounded-xl text-ink placeholder-ink-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue focus:border-electric-blue/50 transition-colors font-inter"
                                    placeholder="Your Company"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-ink-2 mb-2 font-inter">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-edge rounded-xl text-ink placeholder-ink-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue focus:border-electric-blue/50 transition-colors font-inter"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-ink-2 mb-2 font-inter">Company Size</label>
                            <select
                                name="employees"
                                value={formData.employees}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-900 border border-edge rounded-xl text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue focus:border-electric-blue/50 transition-colors font-inter"
                            >
                                <option value="">Select company size</option>
                                <option value="1-10">1–10 employees</option>
                                <option value="11-50">11–50 employees</option>
                                <option value="51-200">51–200 employees</option>
                                <option value="201-500">201–500 employees</option>
                                <option value="500+">500+ employees</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-ink-2 mb-2 font-inter">What would you like to discuss?</label>
                            <textarea
                                name="message"
                                rows={4}
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white/5 border border-edge rounded-xl text-ink placeholder-ink-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue focus:border-electric-blue/50 transition-colors resize-none font-inter"
                                placeholder="Tell us about your automation needs..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-electric-blue to-vivid-purple text-ink px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-glow-md disabled:opacity-50 disabled:cursor-not-allowed font-outfit btn-shimmer overflow-hidden"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Sending Request...
                                </span>
                            ) : (
                                '📅 Schedule My Demo'
                            )}
                        </button>
                    </form>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    {[
                        { icon: '⚡', title: '30-Min Session', desc: 'Quick and focused' },
                        { icon: '🎯', title: 'Personalized', desc: 'Tailored to your use case' },
                        { icon: '💡', title: 'Expert Guidance', desc: 'Direct from our team' }
                    ].map((item) => (
                        <div key={item.title} className="bg-white/[0.03] border border-edge rounded-xl p-5 text-center">
                            <div className="text-2xl mb-2">{item.icon}</div>
                            <h3 className="text-sm font-bold text-ink mb-1 font-outfit">{item.title}</h3>
                            <p className="text-ink-3 text-xs font-jakarta">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ScheduleDemo;

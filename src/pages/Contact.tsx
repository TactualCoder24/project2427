import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            company: formData.company || null,
            subject: formData.subject,
            message: formData.message
          }
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      });

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-24 bg-atmospheric-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Editorial Style */}
        <div className="text-center mb-24 animate-fadeInUp">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-black mb-10">
            Get in <span className="text-gradient-editorial">Touch</span>
          </h1>
          <p className="text-2xl md:text-3xl text-ink-2 max-w-4xl mx-auto font-body leading-relaxed">
            Ready to transform your business with AI? Let's discuss how our full-stack AI services can help you achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form - Brutalist Editorial */}
          <Card variant="premium" className="p-12 hover-lift shadow-editorial glass-editorial">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-10 text-gradient-editorial">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-ink-2 mb-3 font-body uppercase tracking-wide">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-4 glass-editorial border-2 border-electric-amber/30 rounded-2xl text-ink placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-electric-amber focus:border-electric-amber transition-all duration-300 font-body"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-ink-2 mb-3 font-body uppercase tracking-wide">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-4 glass-editorial border-2 border-deep-cyan/30 rounded-2xl text-ink placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-deep-cyan focus:border-deep-cyan transition-all duration-300 font-body"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-ink-2 mb-3 font-body uppercase tracking-wide">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 glass-editorial border-2 border-vintage-magenta/30 rounded-2xl text-ink placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-vintage-magenta focus:border-vintage-magenta transition-all duration-300 font-body"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-ink-2 mb-3 font-body uppercase tracking-wide">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-4 glass-editorial border-2 border-retro-orange/30 rounded-2xl text-ink focus:outline-none focus:ring-2 focus:ring-retro-orange focus:border-retro-orange transition-all duration-300 font-body bg-surface-2"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="demo">Request Demo</option>
                  <option value="pricing">Pricing Information</option>
                  <option value="partnership">Partnership</option>
                  <option value="support">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-ink-2 mb-3 font-body uppercase tracking-wide">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-5 py-4 glass-editorial border-2 border-electric-amber/30 rounded-2xl text-ink placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-electric-amber focus:border-electric-amber transition-all duration-300 resize-none font-body"
                  placeholder="Tell us about your project and how we can help..."
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full shadow-atmospheric hover-lift"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message 📧'}
              </Button>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="p-4 glass-premium border border-neon-green/30 rounded-xl animate-fadeInUp">
                  <p className="text-neon-green font-semibold font-inter flex items-center">
                    <span className="mr-2">✓</span>
                    Message sent successfully! We'll get back to you soon.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="p-4 glass-premium border border-red-500/30 rounded-xl animate-fadeInUp">
                  <p className="text-red-400 font-semibold font-inter flex items-center">
                    <span className="mr-2">✗</span>
                    {errorMessage}
                  </p>
                </div>
              )}
            </form>
          </Card>

          {/* Contact Information - Editorial Cards */}
          <div className="space-y-10">
            <Card variant="gradient" className="p-12 hover-lift shadow-editorial glass-editorial">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-10 text-gradient-retro">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyber-aqua to-cyber-aqua rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow-md">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 font-inter">Email</h3>
                    <p className="text-ink-2 font-inter">hello@vidvasai.com</p>
                    <p className="text-ink-2 font-inter">support@vidvasai.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-neon-green to-lime-green rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(0,255,136,0.6)]">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 font-inter">Address</h3>
                    <p className="text-ink-2 font-inter">Delhi, India 🇮🇳</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral-accent/20 to-alert-amber/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-ink mb-1 font-inter">Phone</h3>
                    <p className="text-ink-2 font-inter">+91 98765 43210</p>
                    <p className="text-sm text-ink-2 font-inter">Mon-Fri, 9AM-6PM IST</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8" glassmorphism>
              <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
              <div className="space-y-4">
                <a href="/demo" className="w-full flex items-center justify-start px-4 py-3 glass-premium border border-edge rounded-xl text-ink hover:border-intelligence-blue/50 transition-all">
                  <span className="mr-3">📅</span>
                  Schedule a Demo
                </a>
                <a href="/support" className="w-full flex items-center justify-start px-4 py-3 glass-premium border border-edge rounded-xl text-ink hover:border-intelligence-blue/50 transition-all">
                  <span className="mr-3">💬</span>
                  Live Chat Support
                </a>
                <a href="/docs" className="w-full flex items-center justify-start px-4 py-3 glass-premium border border-edge rounded-xl text-ink hover:border-intelligence-blue/50 transition-all">
                  <span className="mr-3">📚</span>
                  Documentation
                </a>
                <a href="/faq" className="w-full flex items-center justify-start px-4 py-3 glass-premium border border-edge rounded-xl text-ink hover:border-intelligence-blue/50 transition-all">
                  <span className="mr-3">❓</span>
                  FAQ
                </a>
              </div>
            </Card>

            <Card className="p-8" glassmorphism>
              <h2 className="text-2xl font-bold mb-6 text-ink">Follow Us</h2>
              <div className="flex space-x-4">
                <button type="button" className="w-12 h-12 bg-surface-3 border border-edge rounded-full flex items-center justify-center text-ink hover:bg-neon-blue hover:text-black transition-all duration-200">
                  <span className="text-xl">𝕏</span>
                </button>
                <button type="button" className="w-12 h-12 bg-surface-3 border border-edge rounded-full flex items-center justify-center text-ink hover:bg-neon-blue hover:text-black transition-all duration-200">
                  <span className="text-xl">💼</span>
                </button>
                <button type="button" className="w-12 h-12 bg-surface-3 border border-edge rounded-full flex items-center justify-center text-ink hover:bg-neon-blue hover:text-black transition-all duration-200">
                  <span className="text-xl">⚡</span>
                </button>
                <button type="button" className="w-12 h-12 bg-surface-3 border border-edge rounded-full flex items-center justify-center text-ink hover:bg-neon-blue hover:text-black transition-all duration-200">
                  <span className="text-xl">💬</span>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;



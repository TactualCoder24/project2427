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
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-inter mb-8">
            Get in <span className="text-gradient-animate">Touch</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-inter leading-relaxed">
            Ready to transform your business with AI? Let's discuss how our agentic AI solutions can help you achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card variant="premium" className="p-10 hover-glow">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-inter text-gradient-intelligence">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 glass-premium border border-light-gray/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-aqua focus:border-transparent transition-all duration-200"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 glass-premium border border-light-gray/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-aqua focus:border-transparent transition-all duration-200"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 glass-premium border border-light-gray/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-aqua focus:border-transparent transition-all duration-200"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 glass-premium border border-light-gray/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyber-aqua focus:border-transparent transition-all duration-200 bg-dark-gray"
                  style={{
                    backgroundColor: '#1A1A1A',
                    color: '#FFFFFF'
                  }}
                >
                  <option value="" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>Select a subject</option>
                  <option value="general" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>General Inquiry</option>
                  <option value="demo" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>Request Demo</option>
                  <option value="pricing" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>Pricing Information</option>
                  <option value="partnership" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>Partnership</option>
                  <option value="support" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>Technical Support</option>
                  <option value="other" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2 font-inter">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 glass-premium border border-light-gray/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-aqua focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us about your project and how we can help..."
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full shadow-glow-purple"
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

          {/* Contact Information */}
          <div className="space-y-8">
            <Card variant="gradient" className="p-10 hover-glow">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 font-inter text-gradient">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyber-aqua to-cyber-aqua rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow-md">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 font-inter">Email</h3>
                    <p className="text-gray-300 font-inter">hello@vidvasai.com</p>
                    <p className="text-gray-300 font-inter">support@vidvasai.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-neon-green to-lime-green rounded-2xl flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(0,255,136,0.6)]">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 font-inter">Address</h3>
                    <p className="text-gray-300 font-inter">Delhi, India 🇮🇳</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral-accent/20 to-alert-amber/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1 font-inter">Phone</h3>
                    <p className="text-gray-300 font-inter">+91 98765 43210</p>
                    <p className="text-sm text-gray-400 font-inter">Mon-Fri, 9AM-6PM IST</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8" glassmorphism>
              <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
              <div className="space-y-4">
                <a href="/demo" className="w-full flex items-center justify-start px-4 py-3 glass-premium border border-white/10 rounded-xl text-white hover:border-intelligence-blue/50 transition-all">
                  <span className="mr-3">📅</span>
                  Schedule a Demo
                </a>
                <a href="/support" className="w-full flex items-center justify-start px-4 py-3 glass-premium border border-white/10 rounded-xl text-white hover:border-intelligence-blue/50 transition-all">
                  <span className="mr-3">💬</span>
                  Live Chat Support
                </a>
                <a href="/docs" className="w-full flex items-center justify-start px-4 py-3 glass-premium border border-white/10 rounded-xl text-white hover:border-intelligence-blue/50 transition-all">
                  <span className="mr-3">📚</span>
                  Documentation
                </a>
                <a href="/faq" className="w-full flex items-center justify-start px-4 py-3 glass-premium border border-white/10 rounded-xl text-white hover:border-intelligence-blue/50 transition-all">
                  <span className="mr-3">❓</span>
                  FAQ
                </a>
              </div>
            </Card>

            <Card className="p-8" glassmorphism>
              <h2 className="text-2xl font-bold mb-6">Follow Us</h2>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 bg-medium-gray rounded-full flex items-center justify-center hover:bg-neon-blue hover:text-black transition-all duration-200">
                  <span className="text-xl">𝕏</span>
                </a>
                <a href="#" className="w-12 h-12 bg-medium-gray rounded-full flex items-center justify-center hover:bg-neon-blue hover:text-black transition-all duration-200">
                  <span className="text-xl">💼</span>
                </a>
                <a href="#" className="w-12 h-12 bg-medium-gray rounded-full flex items-center justify-center hover:bg-neon-blue hover:text-black transition-all duration-200">
                  <span className="text-xl">⚡</span>
                </a>
                <a href="#" className="w-12 h-12 bg-medium-gray rounded-full flex items-center justify-center hover:bg-neon-blue hover:text-black transition-all duration-200">
                  <span className="text-xl">💬</span>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;



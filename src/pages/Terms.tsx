import React from 'react';
import Card from '../components/Card';

const Terms: React.FC = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: "By accessing and using VIDVAS AI services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      title: "Service Description",
      content: "VIDVAS AI provides artificial intelligence solutions including but not limited to:",
      list: [
        "AI agent deployment and management",
        "Data analysis and processing services",
        "Automated workflow solutions",
        "Customer support automation",
        "Content generation and optimization"
      ]
    },
    {
      title: "User Responsibilities",
      content: "Users are responsible for:",
      list: [
        "Providing accurate and complete information",
        "Maintaining the security of their account credentials",
        "Using the service in compliance with applicable laws",
        "Not attempting to reverse engineer or compromise our systems",
        "Respecting intellectual property rights"
      ]
    },
    {
      title: "Data Usage and Privacy",
      content: "We are committed to protecting your privacy and data. Our AI agents process data to provide services, but we implement strict security measures and do not sell personal information to third parties. Please refer to our Privacy Policy for detailed information about data handling."
    },
    {
      title: "Service Availability",
      content: "While we strive for 99.9% uptime, we cannot guarantee uninterrupted service availability. Scheduled maintenance will be communicated in advance when possible. We are not liable for service interruptions beyond our reasonable control."
    },
    {
      title: "Intellectual Property",
      content: "All intellectual property rights in our AI technology, algorithms, and software remain with VIDVAS AI. Users retain ownership of their data and content, while granting us necessary licenses to provide services."
    },
    {
      title: "Limitation of Liability",
      content: "VIDVAS AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service."
    },
    {
      title: "Termination",
      content: "Either party may terminate this agreement at any time. Upon termination, your access to the service will cease, and any outstanding obligations will remain in effect."
    },
    {
      title: "Changes to Terms",
      content: "We reserve the right to modify these terms at any time. Users will be notified of significant changes, and continued use of the service constitutes acceptance of the modified terms."
    }
  ];

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-inter mb-6">
            Terms and <span className="text-gradient-cyber">Conditions</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-6 font-inter">
            Last updated: December 2025
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-electric-blue via-vivid-purple to-hot-pink mx-auto rounded-full"></div>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {sections.map((section, index) => (
            <Card key={index} variant="premium" className="p-8 hover-glow">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-electric-blue to-vivid-purple rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow-md">
                  <span className="text-white font-bold text-xl font-inter">{index + 1}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gradient-cyber font-inter">{section.title}</h2>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-4 font-inter">
                {section.content}
              </p>

              {section.list && (
                <ul className="space-y-3">
                  {section.list.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-gray-300">
                      <span className="text-neon-green text-xl mr-3 mt-1">•</span>
                      <span className="font-inter text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card variant="gradient" className="p-10 text-center hover-glow">
          <div className="w-20 h-20 bg-gradient-to-br from-electric-blue to-cyber-cyan rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-glow-md animate-float">
            <span className="text-4xl">📧</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-inter text-gradient">Questions About These Terms?</h2>
          <p className="text-gray-300 text-lg mb-8 font-inter">
            For questions about these Terms and Conditions, please contact us:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-6 glass-premium rounded-2xl border border-electric-blue/20">
              <p className="text-gradient-cyber font-semibold text-lg mb-2 font-inter">Email</p>
              <p className="text-gray-300 font-inter">legal@vidvasai.com</p>
            </div>
            <div className="p-6 glass-premium rounded-2xl border border-vivid-purple/20">
              <p className="text-gradient font-semibold text-lg mb-2 font-inter">Address</p>
              <p className="text-gray-300 font-inter">Delhi, India 🇮🇳</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Terms;


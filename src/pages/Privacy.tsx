import React from 'react';
import Card from '../components/Card';

const Privacy: React.FC = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.",
      subsections: [
        {
          subtitle: "Personal Information",
          items: ["Name and contact information", "Account credentials", "Payment information", "Communication preferences"]
        },
        {
          subtitle: "Usage Data",
          items: ["Service usage patterns", "Performance metrics", "Error logs and diagnostics", "Feature interaction data"]
        }
      ]
    },
    {
      title: "How We Use Your Information",
      content: "We use the information we collect to:",
      list: [
        "Provide, maintain, and improve our AI services",
        "Process transactions and send related information",
        "Send technical notices and support messages",
        "Respond to your comments and questions",
        "Develop new features and services",
        "Ensure security and prevent fraud"
      ]
    },
    {
      title: "Data Processing and AI Training",
      content: "Our AI agents process your data to provide services. We implement several safeguards:",
      list: [
        "Data is processed only for the specific services you request",
        "We use encryption and secure processing environments",
        "Personal data is not used to train our general AI models without explicit consent",
        "You can request data deletion at any time"
      ]
    },
    {
      title: "Information Sharing",
      content: "We do not sell, trade, or otherwise transfer your personal information to third parties except:",
      list: [
        "With your explicit consent",
        "To trusted service providers who assist in our operations",
        "When required by law or to protect our rights",
        "In connection with a merger, acquisition, or sale of assets"
      ]
    },
    {
      title: "Data Security",
      content: "We implement industry-standard security measures including:",
      list: [
        "End-to-end encryption for data transmission",
        "Secure data storage with access controls",
        "Regular security audits and penetration testing",
        "Employee training on data protection",
        "Incident response procedures"
      ]
    },
    {
      title: "Your Rights and Choices",
      content: "You have the right to:",
      list: [
        "Access and review your personal information",
        "Correct inaccurate or incomplete data",
        "Delete your account and associated data",
        "Export your data in a portable format",
        "Opt-out of marketing communications",
        "Restrict certain data processing activities"
      ]
    }
  ];

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-inter mb-6">
            Privacy <span className="text-gradient-animate">Policy</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-6 font-inter">
            Last updated: December 2025
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-cyber-aqua via-vivid-purple to-hot-pink mx-auto rounded-full"></div>
        </div>

        {/* Privacy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {sections.map((section, index) => (
            <Card key={index} variant="premium" className="p-8 hover-glow">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-vivid-purple to-hot-pink rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow-purple">
                  <span className="text-white font-bold text-xl font-inter">{index + 1}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gradient font-inter">{section.title}</h2>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-4 font-inter">
                {section.content}
              </p>

              {section.subsections && (
                <div className="space-y-4">
                  {section.subsections.map((subsection, subIndex) => (
                    <div key={subIndex}>
                      <h3 className="text-xl font-semibold text-gradient-intelligence mb-3 font-inter">{subsection.subtitle}</h3>
                      <ul className="space-y-2">
                        {subsection.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start text-gray-300">
                            <span className="text-neon-green text-lg mr-2 mt-1">•</span>
                            <span className="font-inter">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

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

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card variant="gradient" className="p-8 hover-glow">
            <h2 className="text-3xl font-bold mb-6 text-gradient-intelligence font-inter">Data Retention</h2>
            <p className="text-gray-300 text-lg leading-relaxed font-inter">
              We retain your information for as long as necessary to provide services and fulfill legal obligations.
              When you delete your account, we will delete your personal information within 30 days,
              except where retention is required by law.
            </p>
          </Card>

          <Card variant="gradient" className="p-8 hover-glow">
            <h2 className="text-3xl font-bold mb-6 text-gradient-quantum font-inter">Children's Privacy</h2>
            <p className="text-gray-300 text-lg leading-relaxed font-inter">
              Our services are not intended for children under 13. We do not knowingly collect personal information
              from children under 13. If we become aware of such collection, we will delete the information immediately.
            </p>
          </Card>
        </div>

        {/* Contact Section */}
        <Card variant="gradient" className="p-10 text-center hover-glow">
          <div className="w-20 h-20 bg-gradient-to-br from-neon-green to-lime-green rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(0,255,136,0.6)] animate-float">
            <span className="text-4xl">🔒</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-inter text-gradient-quantum">Privacy Questions?</h2>
          <p className="text-gray-300 text-lg mb-8 font-inter">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 glass-premium rounded-2xl border border-cyber-aqua/20">
              <p className="text-gradient-intelligence font-semibold text-lg mb-2 font-inter">Email</p>
              <p className="text-gray-300 font-inter">privacy@vidvasai.com</p>
            </div>
            <div className="p-6 glass-premium rounded-2xl border border-vivid-purple/20">
              <p className="text-gradient font-semibold text-lg mb-2 font-inter">Data Protection Officer</p>
              <p className="text-gray-300 font-inter">dpo@vidvasai.com</p>
            </div>
            <div className="p-6 glass-premium rounded-2xl border border-hot-pink/20">
              <p className="text-gradient-quantum font-semibold text-lg mb-2 font-inter">Address</p>
              <p className="text-gray-300 font-inter">Delhi, India 🇮🇳</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;



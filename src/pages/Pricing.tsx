import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      yearlyPrice: '₹0',
      period: '/forever',
      description: 'Try VIDVAS AI with limited features',
      features: [
        '1 AI Agent (Choose Once)',
        '10 Workflow Executions/month',
        'Basic Gmail Integration',
        'Community Support',
        '100 MB Storage',
        'No Credit Card Required'
      ],
      cta: 'Start Free',
      popular: false,
      gradient: 'from-neural-gray/20 to-cyber-aqua/20',
      badge: 'Forever Free'
    },
    {
      name: 'Starter',
      price: '₹99',
      yearlyPrice: '₹990',
      period: isYearly ? '/year' : '/month',
      description: 'Perfect for individuals and small projects',
      features: [
        '5 AI Agents',
        '100 Workflow Executions/month',
        'Basic Integrations (Gmail, Slack)',
        'Email Support',
        '1 GB Storage',
        'Community Access'
      ],
      cta: 'Start Free Trial',
      popular: false,
      gradient: 'from-cyber-aqua/20 to-intelligence-blue/20',
      savings: isYearly ? 'Save ₹198/year' : null
    },
    {
      name: 'Professional',
      price: '₹999',
      yearlyPrice: '₹9,990',
      period: isYearly ? '/year' : '/month',
      description: 'Ideal for growing teams and businesses',
      features: [
        '25 AI Agents',
        '1,000 Workflow Executions/month',
        'All Integrations (Gmail, Slack, GitHub, Notion)',
        'Priority Support',
        '10 GB Storage',
        'Advanced Analytics',
        'Custom Workflows',
        'API Access'
      ],
      cta: 'Get Started',
      popular: true,
      gradient: 'from-intelligence-blue/20 to-quantum-teal/20',
      savings: isYearly ? 'Save ₹1,998/year' : null,
      specialOffer: isYearly ? '🎉 Best Value - 17% OFF' : null
    },
    {
      name: 'Enterprise',
      price: '₹2,999',
      yearlyPrice: '₹14,990',
      period: isYearly ? '/year' : '/month',
      description: 'For large teams with advanced needs',
      features: [
        'Unlimited AI Agents',
        'Unlimited Workflow Executions',
        'All Integrations + Custom',
        '24/7 Dedicated Support',
        '100 GB Storage',
        'Advanced Analytics & Reporting',
        'Custom AI Training',
        'White-label Options',
        'SLA Guarantee',
        'Dedicated Account Manager'
      ],
      cta: 'Contact Sales',
      popular: false,
      gradient: 'from-quantum-teal/20 to-signal-green/20',
      savings: isYearly ? 'Save ₹20,998/year' : null
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <div className="inline-block px-6 py-3 glass-premium rounded-full text-sm font-bold mb-8 border border-intelligence-blue/30">
          <span className="text-gradient-intelligence">💰 Simple, Transparent Pricing</span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-inter mb-6">
          <span className="text-gradient-intelligence">Affordable AI</span>
          <br />
          <span className="text-white">For Everyone</span>
        </h1>

        <p className="text-xl text-gray-400 max-w-3xl mx-auto font-inter">
          Start automating your workflows with AI at prices designed for the Indian market.
          No hidden fees, cancel anytime.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className={`text-lg font-inter ${!isYearly ? 'text-white font-bold' : 'text-gray-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-16 h-8 rounded-full transition-all ${isYearly ? 'bg-gradient-intelligence' : 'bg-white/20'
              }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${isYearly ? 'transform translate-x-8' : ''
                }`}
            />
          </button>
          <span className={`text-lg font-inter ${isYearly ? 'text-white font-bold' : 'text-gray-400'}`}>
            Yearly
          </span>
          {isYearly && (
            <span className="text-sm bg-signal-green/20 text-signal-green px-3 py-1 rounded-full font-inter">
              Save up to 17%
            </span>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative glass-premium rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 ${plan.popular
                ? 'border-intelligence-blue shadow-glow-blue'
                : 'border-white/10 hover:border-intelligence-blue/50'
                }`}
            >
              {/* Popular/Free Badge */}
              {(plan.popular || plan.badge) && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className={`${plan.popular ? 'bg-gradient-intelligence shadow-glow-blue' : 'bg-gradient-quantum'
                    } text-white px-4 py-1 rounded-full text-xs font-bold`}>
                    {plan.badge || 'Most Popular'}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2 font-inter">{plan.name}</h3>
                <p className="text-gray-400 text-xs mb-4 font-inter">{plan.description}</p>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-gradient-intelligence">
                    {isYearly && plan.yearlyPrice !== plan.price ? plan.yearlyPrice : plan.price}
                  </span>
                  <span className="text-gray-400 text-sm font-inter">{plan.period}</span>
                  {plan.savings && (
                    <p className="text-signal-green text-xs mt-1 font-inter">{plan.savings}</p>
                  )}
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className={`w-full py-3 rounded-xl font-bold font-inter transition-all duration-300 text-sm ${plan.popular
                    ? 'bg-gradient-intelligence text-white shadow-glow-blue hover:shadow-glow-teal'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                >
                  {plan.cta}
                </button>
              </div>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-intelligence-blue/20 flex items-center justify-center mt-0.5">
                      <svg className="w-2.5 h-2.5 text-intelligence-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300 text-xs font-inter">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <h2 className="text-4xl font-bold text-center mb-12 font-inter">
          <span className="text-gradient-intelligence">Frequently Asked</span>{' '}
          <span className="text-white">Questions</span>
        </h2>

        <div className="space-y-6">
          {[
            {
              q: 'Can I switch plans anytime?',
              a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
            },
            {
              q: 'Is there a free trial?',
              a: 'Yes, all paid plans come with a 14-day free trial. No credit card required to start.'
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept UPI, Credit/Debit Cards, Net Banking, and all major payment methods via Razorpay.'
            },
            {
              q: 'Do you offer refunds?',
              a: 'Yes, we offer a 30-day money-back guarantee if you\'re not satisfied with our service.'
            }
          ].map((faq, index) => (
            <div key={index} className="glass-premium rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-3 font-inter">{faq.q}</h3>
              <p className="text-gray-400 font-inter">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center">
        <div className="glass-premium rounded-2xl p-12 border border-intelligence-blue/30">
          <h2 className="text-4xl font-bold mb-6 font-inter">
            <span className="text-gradient-intelligence">Ready to Transform</span>{' '}
            <span className="text-white">Your Workflow?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 font-inter">
            Join thousands of users automating their work with AI
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-intelligence text-white px-12 py-4 rounded-xl font-bold text-lg shadow-glow-blue hover:shadow-glow-teal transition-all duration-300 font-inter"
          >
            Start Your Free Trial
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

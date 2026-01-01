import React from 'react';

const FAQ: React.FC = () => {
    const faqs = [
        {
            category: 'Getting Started',
            questions: [
                {
                    q: 'What is VIDVAS AI?',
                    a: 'VIDVAS AI is an intelligent automation platform that uses AI agents to automate workflows, integrate with your favorite tools, and boost productivity.'
                },
                {
                    q: 'How do I get started?',
                    a: 'Simply sign up for a free trial, connect your integrations (Gmail, Slack, etc.), and start creating AI-powered workflows in minutes.'
                },
                {
                    q: 'Do I need coding knowledge?',
                    a: 'No! VIDVAS AI is designed to be user-friendly with a visual workflow builder. No coding required.'
                }
            ]
        },
        {
            category: 'Pricing & Plans',
            questions: [
                {
                    q: 'Is there a free trial?',
                    a: 'Yes! All plans come with a 14-day free trial. No credit card required to start.'
                },
                {
                    q: 'Can I change my plan later?',
                    a: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
                },
                {
                    q: 'What payment methods do you accept?',
                    a: 'We accept UPI, Credit/Debit Cards, Net Banking, and all major payment methods via Razorpay.'
                }
            ]
        },
        {
            category: 'Features',
            questions: [
                {
                    q: 'What integrations are supported?',
                    a: 'We support Gmail, Slack, GitHub, Notion, and many more. Custom integrations are available on Enterprise plans.'
                },
                {
                    q: 'How many AI agents can I create?',
                    a: 'It depends on your plan: Starter (5), Professional (25), Enterprise (Unlimited).'
                },
                {
                    q: 'Can I customize AI agent behavior?',
                    a: 'Yes! You can create custom personas, define specific instructions, and train agents for your unique needs.'
                }
            ]
        },
        {
            category: 'Security & Privacy',
            questions: [
                {
                    q: 'Is my data secure?',
                    a: 'Yes! We use enterprise-grade encryption, secure authentication, and follow industry best practices for data protection.'
                },
                {
                    q: 'Where is my data stored?',
                    a: 'Data is stored securely in India-based servers with automatic backups and redundancy.'
                },
                {
                    q: 'Do you sell my data?',
                    a: 'Never. Your data is yours. We do not sell, share, or use your data for any purpose other than providing our service.'
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen pt-20 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block px-6 py-3 glass-premium rounded-full text-sm font-bold mb-8 border border-intelligence-blue/30">
                        <span className="text-gradient-intelligence">❓ Frequently Asked Questions</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold font-inter mb-6">
                        <span className="text-gradient-intelligence">Got Questions?</span>
                        <br />
                        <span className="text-white">We've Got Answers</span>
                    </h1>

                    <p className="text-xl text-gray-400 font-inter">
                        Find answers to common questions about VIDVAS AI
                    </p>
                </div>

                {/* FAQ Categories */}
                <div className="space-y-12">
                    {faqs.map((category, catIdx) => (
                        <div key={catIdx}>
                            <h2 className="text-3xl font-bold text-gradient-intelligence mb-6 font-inter">
                                {category.category}
                            </h2>

                            <div className="space-y-4">
                                {category.questions.map((faq, idx) => (
                                    <div key={idx} className="glass-premium rounded-xl p-6 border border-white/10 hover:border-intelligence-blue/30 transition-all">
                                        <h3 className="text-xl font-bold text-white mb-3 font-inter">{faq.q}</h3>
                                        <p className="text-gray-400 font-inter leading-relaxed">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-16 glass-premium rounded-2xl p-8 border border-intelligence-blue/30 text-center">
                    <h2 className="text-3xl font-bold mb-4 font-inter">
                        <span className="text-gradient-intelligence">Still Have Questions?</span>
                    </h2>
                    <p className="text-gray-400 mb-6 font-inter">
                        Our team is here to help! Reach out and we'll get back to you within 24 hours.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="bg-gradient-intelligence text-white px-8 py-3 rounded-xl font-bold shadow-glow-blue hover:shadow-glow-teal transition-all duration-300 font-inter"
                        >
                            Contact Support
                        </a>
                        <a
                            href="/demo"
                            className="bg-white/10 text-white px-8 py-3 rounded-xl font-bold border border-white/20 hover:bg-white/20 transition-all duration-300 font-inter"
                        >
                            Schedule a Demo
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;

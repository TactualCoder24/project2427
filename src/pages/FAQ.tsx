import React from 'react';

const FAQ: React.FC = () => {
    const faqs = [
        {
            category: 'Getting Started',
            questions: [
                {
                    q: 'What is VIDVAS AI?',
                    a: 'VIDVAS AI is India\'s premier full-stack AI services company. We provide AI automation, intelligent agents, custom AI development, RAG pipelines, AI consulting, and enterprise integrations — all from one platform.'
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
                    q: 'What AI services does VIDVAS AI offer?',
                    a: 'We offer AI Automation & Workflows, Intelligent AI Agents, Custom AI Development, RAG & Knowledge Bases, AI Consulting, and Enterprise Integrations (Gmail, Slack, GitHub, Notion, and more).'
                },
                {
                    q: 'Can I get custom AI solutions built for my business?',
                    a: 'Absolutely! Our Professional and Enterprise plans include custom AI development, bespoke workflow automation, and dedicated consulting to tailor AI to your specific business needs.'
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
                <div className="text-center mb-16">
                    <div className="inline-block px-6 py-3 glass-premium rounded-full text-sm font-bold mb-8 border border-intelligence-blue/30">
                        <span className="text-gradient-intelligence">Frequently Asked Questions</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold font-inter mb-6">
                        <span className="text-gradient-intelligence">Got Questions?</span>
                        <br />
                        <span className="text-ink">We Have Answers</span>
                    </h1>
                    <p className="text-xl text-ink-2 font-inter">
                        Find answers to common questions about VIDVAS AI
                    </p>
                </div>

                <div className="space-y-12">
                    {faqs.map((category, catIdx) => (
                        <div key={catIdx}>
                            <h2 className="text-3xl font-bold text-gradient-intelligence mb-6 font-inter">
                                {category.category}
                            </h2>
                            <div className="space-y-4">
                                {category.questions.map((faq, idx) => (
                                    <div key={idx} className="glass-premium rounded-xl p-6 border border-edge hover:border-intelligence-blue/30 transition-all">
                                        <h3 className="text-xl font-bold text-ink mb-3 font-inter">{faq.q}</h3>
                                        <p className="text-ink-2 font-inter leading-relaxed">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 glass-premium rounded-2xl p-8 border border-intelligence-blue/30 text-center">
                    <h2 className="text-3xl font-bold mb-4 font-inter">
                        <span className="text-gradient-intelligence">Still Have Questions?</span>
                    </h2>
                    <p className="text-ink-2 mb-6 font-inter">
                        Our team is here to help. Reach out and we will get back to you within 24 hours.
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
                            className="bg-ink/[0.06] text-ink px-8 py-3 rounded-xl font-bold border border-edge-2 hover:bg-ink/[0.12] transition-all duration-300 font-inter"
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

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import CountdownTimer from '../components/CountdownTimer';

const FEATURES = [
    {
        icon: '🧠',
        title: 'Autonomous Intelligence',
        desc: 'Autonomous AI that perceives, decides, and acts — handling complex multi-step tasks without constant supervision.',
        gradientFrom: 'from-electric-blue',
        gradientTo: 'to-cyber-cyan',
        shadow: 'shadow-glow-md',
        textGradient: 'text-gradient-cyber',
    },
    {
        icon: '⚡',
        title: 'Lightning Execution',
        desc: 'Sub-second responses. Process thousands of tasks in parallel with 99.9% uptime guaranteed.',
        gradientFrom: 'from-vivid-purple',
        gradientTo: 'to-hot-pink',
        shadow: 'shadow-glow-purple',
        textGradient: 'text-gradient',
    },
    {
        icon: '🔗',
        title: 'Deep Integrations',
        desc: 'Connect Gmail, Slack, Notion, GitHub, and 50+ apps out of the box. Your entire stack, automated.',
        gradientFrom: 'from-neon-green',
        gradientTo: 'to-cyber-cyan',
        shadow: 'shadow-[0_0_30px_rgba(0,255,136,0.6)]',
        textGradient: 'text-gradient-electric',
    },
    {
        icon: '🔒',
        title: 'Enterprise Security',
        desc: 'End-to-end encryption, Row-Level Security, SOC 2 compliant. Your data never leaves your control.',
        gradientFrom: 'from-electric-blue',
        gradientTo: 'to-vivid-purple',
        shadow: 'shadow-glow-md',
        textGradient: 'text-gradient-cyber',
    },
    {
        icon: '🎭',
        title: 'Custom Personas',
        desc: 'Give agents a personality, instructions, and goals. Train them to match your brand voice.',
        gradientFrom: 'from-hot-pink',
        gradientTo: 'to-amber-glow',
        shadow: 'shadow-glow-pink',
        textGradient: 'text-gradient',
    },
    {
        icon: '📊',
        title: 'Live Dashboards',
        desc: 'Real-time execution logs, step-level status, success rates — full observability on every run.',
        gradientFrom: 'from-vivid-purple',
        gradientTo: 'to-electric-blue',
        shadow: 'shadow-glow-purple',
        textGradient: 'text-gradient-electric',
    },
];

const STEPS = [
    { n: '01', title: 'Connect your apps', desc: 'Link Gmail, Slack, GitHub, Notion in one click via OAuth.', color: 'text-gradient-cyber' },
    { n: '02', title: 'Build a workflow', desc: 'Chain AI services together visually with drag-and-drop. No code needed.', color: 'text-gradient' },
    { n: '03', title: 'Set your trigger', desc: 'Run manually, on a schedule, via webhook, or on an event.', color: 'text-gradient-electric' },
    { n: '04', title: 'Watch it run', desc: 'Real-time execution dashboard updates as each step completes.', color: 'text-gradient-cyber' },
];

const FAQS = [
    {
        q: 'What is VIDVAS AI?',
        a: "We're an AI lab based in India — we research and build intelligent agents, automation workflows, custom AI systems, RAG knowledge bases, and enterprise integrations, all from one platform.",
        qGradient: 'text-gradient-cyber',
    },
    {
        q: 'Do I need to write code?',
        a: 'No. The visual workflow builder lets you chain agents together with dropdowns and drag-and-drop. Zero code required.',
        qGradient: 'text-gradient',
    },
    {
        q: 'Is my data secure?',
        a: 'Yes. We use Supabase with Row-Level Security so your data is completely isolated. End-to-end encryption in transit and at rest.',
        qGradient: 'text-gradient-electric',
    },
    {
        q: 'How quickly can I go live?',
        a: 'You can have your first workflow running in under 10 minutes using one of our pre-built templates.',
        qGradient: 'text-gradient-cyber',
    },
    {
        q: 'Do I need technical expertise?',
        a: 'No technical expertise required. Our platform is designed for business users with intuitive interfaces and comprehensive team support.',
        qGradient: 'text-gradient',
    },
    {
        q: "What's the pricing model?",
        a: 'We offer flexible pricing based on usage and features. Check our Pricing page or contact sales for a customized quote.',
        qGradient: 'text-gradient-electric',
    },
];

const Home: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen">

            {/* ── HERO ──────────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-surface via-surface-2 to-surface">
                {/* Animated radial glows */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(14,165,233,0.16),transparent_65%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(14,165,233,0.2),transparent_70%)] animate-smoothPulse" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_65%,rgba(37,99,235,0.14),transparent_65%)] dark:bg-[radial-gradient(circle_at_85%_65%,rgba(37,99,235,0.2),transparent_70%)] animate-smoothPulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent" />

                    {/* Floating particles */}
                    <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-electric-blue rounded-full animate-float opacity-50 shadow-glow-sm" />
                    <div className="absolute top-1/3 right-[8%] w-3 h-3 bg-vivid-purple rounded-full animate-float opacity-40 shadow-glow-purple" style={{ animationDelay: '2s' }} />
                    <div className="absolute bottom-1/4 left-[10%] w-3 h-3 bg-hot-pink rounded-full animate-float opacity-45 shadow-glow-pink" style={{ animationDelay: '4s' }} />
                    <div className="absolute top-1/2 left-[6%] w-2 h-2 bg-neon-green rounded-full animate-float opacity-35" style={{ animationDelay: '5s' }} />
                </div>

                <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-28 sm:py-32 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">

                    {/* ── Left: copy ── */}
                    <div className="text-left">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 glass-premium rounded-full text-xs sm:text-sm font-bold mb-7 animate-fadeInUp border border-electric-blue/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-smoothPulse" />
                            <span className="text-gradient-cyber">India's AI Lab</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-bold font-outfit mb-6 animate-slideUp leading-[1.05] tracking-tight text-ink">
                            Agents that
                            <span className="block text-gradient-animate drop-shadow-2xl">actually get it done.</span>
                        </h1>

                        {/* Sanskrit subtitle */}
                        <div className="mb-6 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
                            <p className="text-sm sm:text-base text-ink-3 font-jakarta italic">
                                <span className="text-gradient-cyber font-semibold not-italic">विद्वस्</span> (VIDVAS) — Sanskrit for{' '}
                                <span className="text-gradient font-semibold not-italic">"Intelligence"</span>
                            </p>
                        </div>

                        {/* Sub-headline */}
                        <p className="text-lg sm:text-xl text-ink-2 mb-10 max-w-xl animate-fadeInUp font-jakarta font-light leading-relaxed" style={{ animationDelay: '0.2s' }}>
                            We research, build, and ship intelligent agents that work{' '}
                            <span className="text-neon-green font-semibold">24/7</span> — automating tasks, running workflows, and connecting your entire stack, so your team can focus on what matters.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                            <Link to="/login">
                                <Button variant="gradient" size="xl" className="w-full sm:w-auto shadow-glow-purple">
                                    🚀 Get Started Free
                                </Button>
                            </Link>
                            <Link to="/agents">
                                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                                    Explore AI Services →
                                </Button>
                            </Link>
                        </div>

                        {/* Trust strip */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 animate-fadeInUp" style={{ animationDelay: '0.55s' }}>
                            {[
                                { icon: '🔒', label: 'SOC 2 Ready' },
                                { icon: '🇮🇳', label: 'Built in India' },
                                { icon: '⚡', label: 'Supabase Powered' },
                                { icon: '✅', label: 'Free to Start' },
                            ].map(({ icon, label }) => (
                                <span key={label} className="flex items-center gap-1.5 text-xs sm:text-sm text-ink-3 font-jakarta">
                                    <span>{icon}</span>
                                    <span>{label}</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* ── Right: floating product preview ── */}
                    <div className="relative hidden lg:block animate-fadeInUp mt-10 mb-10 mx-6" style={{ animationDelay: '0.35s' }}>
                        {/* Main workflow card */}
                        <div className="bg-surface-2 rounded-3xl border border-edge shadow-editorial p-6 animate-gentleFloat">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-hot-pink/70" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-glow/70" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-neon-green/70" />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-ink-3 font-jakarta">Live Workflow</span>
                            </div>

                            {[
                                { icon: '📧', label: 'New email received', status: 'Done', color: 'bg-neon-green' },
                                { icon: '🧠', label: 'Agent analyzing intent', status: 'Running', color: 'bg-electric-blue' },
                                { icon: '💬', label: 'Draft reply queued', status: 'Waiting', color: 'bg-ink-3' },
                            ].map((step, i) => (
                                <div key={step.label} className={`flex items-center gap-3 py-3 ${i !== 2 ? 'border-b border-edge' : ''}`}>
                                    <div className="w-9 h-9 rounded-lg bg-surface-3 flex items-center justify-center text-base flex-shrink-0">{step.icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-ink font-jakarta font-medium truncate">{step.label}</p>
                                    </div>
                                    <span className={`flex items-center gap-1.5 text-[11px] font-jakarta text-ink-3 flex-shrink-0`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${step.color}`} />
                                        {step.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Floating stat card */}
                        <div className="absolute -top-10 -right-10 bg-surface-2 rounded-2xl border border-edge shadow-glow-sm px-5 py-4 animate-float" style={{ animationDelay: '1s' }}>
                            <div className="text-2xl font-bold text-gradient-cyber font-outfit">10x</div>
                            <div className="text-ink-3 text-[11px] font-jakarta uppercase tracking-wider">Productivity</div>
                        </div>

                        {/* Floating uptime badge */}
                        <div className="absolute -bottom-10 -left-10 bg-surface-2 rounded-2xl border border-edge shadow-glow-purple px-5 py-4 animate-float" style={{ animationDelay: '2.5s' }}>
                            <div className="text-2xl font-bold text-gradient font-outfit">24/7</div>
                            <div className="text-ink-3 text-[11px] font-jakarta uppercase tracking-wider">Always Active</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── COUNTDOWN ─────────────────────────────────────────────── */}
            <section className="py-16 bg-gradient-to-b from-surface to-surface-2/50">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <CountdownTimer />
                </div>
            </section>

            {/* ── FEATURES ──────────────────────────────────────────────── */}
            <section id="features" className="py-24 bg-gradient-to-b from-surface via-surface-2 to-surface">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-gradient-cyber text-sm font-inter font-bold tracking-widest uppercase mb-4">Platform Features</p>
                        <h2 className="text-5xl md:text-6xl font-bold font-outfit text-ink mb-4">
                            Built for the AI era
                        </h2>
                        <p className="text-xl text-ink-2 max-w-2xl mx-auto font-jakarta">
                            Everything you need to automate, build, and scale with AI — in one platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {FEATURES.map((f, i) => (
                            <Card
                                key={f.title}
                                variant="dark"
                                className="p-7"
                                hover={false}
                                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                            >
                                <div className={`w-11 h-11 bg-gradient-to-br ${f.gradientFrom} ${f.gradientTo} rounded-xl flex items-center justify-center mb-5 text-xl`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2 font-outfit text-ink">{f.title}</h3>
                                <p className="text-ink-2 text-sm leading-relaxed font-jakarta">{f.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
            <section className="py-24 bg-gradient-to-b from-surface via-surface-2 to-surface">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <p className="text-gradient-cyber text-sm font-inter font-bold tracking-widest uppercase mb-4">How It Works</p>
                        <h2 className="text-5xl md:text-6xl font-bold font-outfit text-ink mb-4">
                            Up and running in minutes
                        </h2>
                        <p className="text-xl text-ink-2 max-w-2xl mx-auto font-jakarta">
                            From zero to automated workflow in four simple steps.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {STEPS.map((step, i) => (
                            <div key={step.n} className="relative">
                                {i < STEPS.length - 1 && (
                                    <div className="hidden lg:block absolute top-7 left-full w-full h-px bg-gradient-to-r from-edge-2 to-transparent z-0" />
                                )}
                                <Card variant="premium" className="relative z-10 p-6 hover-glow h-full">
                                    <div className={`text-xs font-outfit font-bold ${step.color} mb-4 tracking-widest`}>{step.n}</div>
                                    <h3 className="text-ink font-outfit font-bold text-lg mb-2">{step.title}</h3>
                                    <p className="text-ink-2 font-jakarta text-sm leading-relaxed">{step.desc}</p>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── INTEGRATIONS STRIP ────────────────────────────────────── */}
            <section className="py-20 bg-surface border-t border-edge">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gradient-cyber text-sm font-inter font-bold tracking-widest uppercase mb-8">Works with your favourite tools</p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {[
                            ['📧', 'Gmail'],
                            ['💬', 'Slack'],
                            ['🐙', 'GitHub'],
                            ['📓', 'Notion'],
                            ['📅', 'Calendar'],
                            ['🔍', 'Search'],
                            ['📊', 'Analytics'],
                            ['📄', 'Reports'],
                        ].map(([icon, name]) => (
                            <div key={name as string} className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-premium border border-edge text-ink-2 font-jakarta text-sm hover:border-electric-blue/30 hover:text-ink hover:shadow-glow-sm transition-all duration-300">
                                <span>{icon}</span>
                                <span>{name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ───────────────────────────────────────────────────── */}
            <section className="py-24 bg-gradient-to-b from-surface via-surface-2 to-surface">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <p className="text-gradient-cyber text-sm font-inter font-bold tracking-widest uppercase mb-4">FAQ</p>
                        <h2 className="text-5xl md:text-6xl font-bold font-outfit text-ink mb-4">
                            Frequently asked questions
                        </h2>
                        <p className="text-xl text-ink-2 max-w-2xl mx-auto font-jakarta">
                            Get answers to common questions about our AI lab and what we build.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-3">
                        {FAQS.map((faq, i) => (
                            <div
                                key={i}
                                className="glass-premium rounded-2xl border border-edge overflow-hidden transition-all duration-300"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                                    aria-expanded={openFaq === i}
                                >
                                    <h3 className={`text-lg sm:text-xl font-bold font-outfit ${faq.qGradient} group-hover:opacity-90 transition-opacity`}>
                                        {faq.q}
                                    </h3>
                                    <span
                                        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border border-edge-2 text-ink-3 transition-transform duration-300 ${openFaq === i ? 'rotate-45 bg-ink/10' : ''}`}
                                    >
                                        +
                                    </span>
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-5 border-t border-edge">
                                        <p className="text-ink-2 text-base sm:text-lg font-jakarta leading-relaxed pt-4">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <p className="text-ink-2 text-xl mb-8 font-jakarta">Have more questions?</p>
                        <Link to="/faq">
                            <Button variant="gradient-purple" size="lg">
                                View All FAQs →
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── BOTTOM CTA ────────────────────────────────────────────── */}
            <section className="py-24 bg-gradient-to-b from-surface to-surface-2 relative overflow-hidden border-t border-edge">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.08),transparent_70%)]" />
                <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
                    <p className="text-gradient-cyber text-sm font-inter font-bold tracking-widest uppercase mb-6">Get Started</p>
                    <h2 className="text-5xl md:text-6xl font-bold font-outfit text-ink mb-6">
                        Ready to transform your business?
                    </h2>
                    <p className="text-xl text-ink-2 mb-10 font-jakarta">
                        Join the next generation of companies leveraging the full power of AI services.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/login">
                            <Button variant="gradient" size="lg" className="w-full sm:w-auto">
                                Get Started Free →
                            </Button>
                        </Link>
                        <Link to="/contact">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                Contact Sales
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;

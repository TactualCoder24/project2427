import React from 'react';
import Card from '../components/Card';

const About: React.FC = () => {
  return (
    <div className="min-h-screen py-24 bg-gradient-to-b from-surface via-surface-2/30 to-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="text-center mb-20 animate-fadeInUp">
          <p className="text-gradient-cyber text-sm font-inter font-bold tracking-widest uppercase mb-5">About Us</p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-outfit text-ink mb-6">
            About <span className="text-gradient-animate">VIDVAS AI</span>
          </h1>
          <p className="text-base text-ink-3 font-jakarta italic mb-6">
            <span className="text-gradient-intelligence font-semibold">विद्वस्</span> (VIDVAS) — Sanskrit for{' '}
            <span className="text-ink font-medium">"Intelligence"</span>
          </p>
          <p className="text-xl text-ink-2 max-w-3xl mx-auto font-jakarta leading-relaxed">
            India's premier full-stack AI services company — delivering automation, custom AI development,
            intelligent agents, consulting, and enterprise integrations.
          </p>
        </div>

        {/* Mission & Vision */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card variant="dark" className="p-8" hover={false}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-electric-blue to-cyber-cyan rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  🎯
                </div>
                <h2 className="text-2xl font-bold font-outfit text-ink">Our Mission</h2>
              </div>
              <p className="text-ink-2 text-base font-jakarta leading-relaxed">
                To democratize advanced AI for every Indian business — through automation, custom AI solutions,
                intelligent agents, RAG pipelines, and enterprise integrations — enabling organizations of all sizes
                to achieve unprecedented efficiency, innovation, and growth.
              </p>
            </Card>

            <Card variant="dark" className="p-8" hover={false}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-electric-blue rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  🔮
                </div>
                <h2 className="text-2xl font-bold font-outfit text-ink">Our Vision</h2>
              </div>
              <p className="text-ink-2 text-base font-jakarta leading-relaxed">
                A world where every organization — startup to enterprise — leverages full-spectrum AI services:
                from intelligent automation and custom model development to strategic AI consulting.
                We envision AI and humans collaborating seamlessly to solve India's most complex challenges.
              </p>
            </Card>
          </div>
        </section>

        {/* Approach */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <p className="text-gradient-cyber text-sm font-inter font-bold tracking-widest uppercase mb-4">How We Work</p>
            <h2 className="text-4xl md:text-5xl font-bold font-outfit text-ink mb-4">Our Approach</h2>
            <p className="text-lg text-ink-2 max-w-2xl mx-auto font-jakarta">
              Cutting-edge research combined with practical implementation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card variant="dark" className="p-7" hover={false}>
              <div className="w-11 h-11 bg-gradient-to-br from-electric-blue to-cyber-cyan rounded-xl flex items-center justify-center mb-5 text-xl">
                🔬
              </div>
              <h3 className="text-lg font-bold mb-2 font-outfit text-ink">Research-Driven</h3>
              <p className="text-ink-2 text-sm font-jakarta leading-relaxed">
                Every service is grounded in the latest AI research — from LLMs and RAG to custom model training and fine-tuning.
              </p>
            </Card>

            <Card variant="dark" className="p-7" hover={false}>
              <div className="w-11 h-11 bg-gradient-to-br from-neon-blue to-electric-blue rounded-xl flex items-center justify-center mb-5 text-xl">
                ⚙️
              </div>
              <h3 className="text-lg font-bold mb-2 font-outfit text-ink">Full-Stack AI Services</h3>
              <p className="text-ink-2 text-sm font-jakarta leading-relaxed">
                From automation and workflow AI to custom development, consulting, and enterprise integrations — we cover the entire AI value chain.
              </p>
            </Card>

            <Card variant="dark" className="p-7" hover={false}>
              <div className="w-11 h-11 bg-gradient-to-br from-neon-green to-cyber-cyan rounded-xl flex items-center justify-center mb-5 text-xl">
                🤝
              </div>
              <h3 className="text-lg font-bold mb-2 font-outfit text-ink">Human-Centric</h3>
              <p className="text-ink-2 text-sm font-jakarta leading-relaxed">
                Our AI services amplify human potential — automating the repetitive so people can focus on what matters.
              </p>
            </Card>
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="text-center mb-12">
            <p className="text-gradient-cyber text-sm font-inter font-bold tracking-widest uppercase mb-4">Principles</p>
            <h2 className="text-4xl md:text-5xl font-bold font-outfit text-ink mb-4">Our Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: '🔍', title: 'Transparency', desc: 'Open and honest communication in all our interactions.', gradient: 'from-electric-blue to-cyber-cyan' },
              { icon: '💡', title: 'Innovation', desc: 'Continuously pushing the boundaries of what\'s possible with AI.', gradient: 'from-neon-blue to-electric-blue' },
              { icon: '⭐', title: 'Excellence', desc: 'Delivering the highest quality solutions and service to every client.', gradient: 'from-cyber-cyan to-neon-green' },
              { icon: '🛡️', title: 'Responsibility', desc: 'Building AI that benefits society and fully respects user privacy.', gradient: 'from-neon-green to-electric-blue' },
            ].map(({ icon, title, desc, gradient }) => (
              <Card key={title} variant="dark" className="p-6" hover={false}>
                <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 text-lg`}>
                  {icon}
                </div>
                <h3 className="text-base font-bold mb-2 font-outfit text-ink">{title}</h3>
                <p className="text-ink-2 text-sm font-jakarta leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;

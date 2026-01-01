import React from 'react';
import Card from '../components/Card';

const About: React.FC = () => {
  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fadeInUp">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold font-inter mb-8 animate-slideUp">
            About <span className="text-gradient-animate">VIDVAS AI</span>
          </h1>
          <div className="mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <p className="text-xl md:text-2xl text-gray-400 font-inter italic max-w-3xl mx-auto">
              <span className="text-gradient-cyber font-semibold">विद्वस्</span> (VIDVAS) - Derived from Sanskrit, meaning <span className="text-gradient font-semibold">"Intelligence"</span> or <span className="text-gradient-electric font-semibold">"The Wise One"</span>
            </p>
          </div>
          <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto font-inter leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            We're pioneering the future of business automation through intelligent AI agents
            that transform how organizations operate and scale.
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Card variant="gradient" className="p-10 hover-glow animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-electric-blue to-cyber-cyan rounded-2xl flex items-center justify-center mr-6 animate-float shadow-glow-md">
                  <span className="text-3xl">🎯</span>
                </div>
                <h2 className="text-4xl font-bold font-inter text-gradient-cyber">Our Mission</h2>
              </div>
              <p className="text-gray-300 text-xl font-inter leading-relaxed">
                To democratize access to advanced AI technology by creating intelligent agents
                that seamlessly integrate into existing workflows, enabling businesses of all sizes
                to achieve unprecedented levels of efficiency and innovation.
              </p>
            </Card>

            <Card variant="gradient" className="p-10 hover-glow animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-vivid-purple to-hot-pink rounded-2xl flex items-center justify-center mr-6 animate-float shadow-glow-purple" style={{ animationDelay: '1s' }}>
                  <span className="text-3xl">🔮</span>
                </div>
                <h2 className="text-4xl font-bold font-inter text-gradient">Our Vision</h2>
              </div>
              <p className="text-gray-300 text-xl font-inter leading-relaxed">
                A world where every organization has access to AI agents that handle routine tasks,
                allowing human creativity and strategic thinking to flourish. We envision a future
                where AI and humans collaborate seamlessly to solve complex challenges.
              </p>
            </Card>
          </div>
        </section>

        {/* Approach Section */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold font-inter mb-6 text-gradient-electric">Our Approach</h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-inter">
              We combine cutting-edge research with practical implementation to deliver AI solutions that work in the real world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="premium" className="p-10 text-center hover-glow">
              <div className="w-20 h-20 bg-gradient-to-br from-electric-blue to-cyber-cyan rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-glow-md">
                <span className="text-4xl">🔬</span>
              </div>
              <h3 className="text-2xl font-bold mb-6 font-inter text-gradient-cyber">Research-Driven</h3>
              <p className="text-gray-300 text-lg font-inter leading-relaxed">
                Our solutions are built on the latest breakthroughs in AI research and machine learning.
              </p>
            </Card>

            <Card variant="premium" className="p-10 text-center hover-glow">
              <div className="w-20 h-20 bg-gradient-to-br from-vivid-purple to-hot-pink rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-glow-purple">
                <span className="text-4xl">⚙️</span>
              </div>
              <h3 className="text-2xl font-bold mb-6 font-inter text-gradient">Practical Implementation</h3>
              <p className="text-gray-300 text-lg font-inter leading-relaxed">
                We focus on creating AI that solves real business problems and delivers measurable results.
              </p>
            </Card>

            <Card variant="premium" className="p-10 text-center hover-glow">
              <div className="w-20 h-20 bg-gradient-to-br from-neon-green to-lime-green rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(0,255,136,0.6)]">
                <span className="text-4xl">🤝</span>
              </div>
              <h3 className="text-2xl font-bold mb-6 font-inter text-gradient-electric">Human-Centric</h3>
              <p className="text-gray-300 text-lg font-inter leading-relaxed">
                Our AI is designed to augment human capabilities, not replace them.
              </p>
            </Card>
          </div>
        </section>

        {/* Values Section */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold font-inter mb-6">
              Our <span className="text-gradient-animate">Values</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card variant="gradient" className="p-8 text-center hover-glow">
              <h3 className="text-2xl font-bold mb-4 text-gradient-cyber font-inter">Transparency</h3>
              <p className="text-base text-gray-300 font-inter leading-relaxed">
                Open and honest communication in all our interactions.
              </p>
            </Card>

            <Card variant="gradient" className="p-8 text-center hover-glow">
              <h3 className="text-2xl font-bold mb-4 text-gradient font-inter">Innovation</h3>
              <p className="text-base text-gray-300 font-inter leading-relaxed">
                Continuously pushing the boundaries of what's possible.
              </p>
            </Card>

            <Card variant="gradient" className="p-8 text-center hover-glow">
              <h3 className="text-2xl font-bold mb-4 text-gradient-electric font-inter">Excellence</h3>
              <p className="text-base text-gray-300 font-inter leading-relaxed">
                Delivering the highest quality solutions and service.
              </p>
            </Card>

            <Card variant="gradient" className="p-8 text-center hover-glow">
              <h3 className="text-2xl font-bold mb-4 text-gradient-cyber font-inter">Responsibility</h3>
              <p className="text-base text-gray-300 font-inter leading-relaxed">
                Building AI that benefits society and respects privacy.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;


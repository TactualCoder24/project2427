import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import CountdownTimer from '../components/CountdownTimer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black">
        {/* Enhanced Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(14,165,233,0.2),transparent_70%)] animate-smoothPulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(168,85,247,0.2),transparent_70%)] animate-smoothPulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.15),transparent_80%)] animate-smoothPulse" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Enhanced Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-electric-blue rounded-full animate-float opacity-60 shadow-glow-sm" />
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-vivid-purple rounded-full animate-float opacity-50 shadow-glow-purple" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-hot-pink rounded-full animate-float opacity-55 shadow-glow-pink" style={{ animationDelay: '4s' }} />
          <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-cyber-cyan rounded-full animate-float opacity-45" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/5 w-2 h-2 bg-neon-green rounded-full animate-float opacity-40" style={{ animationDelay: '5s' }} />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20 sm:py-24 md:py-32">
          <div className="mb-6 sm:mb-8">
            <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 glass-premium rounded-full text-xs sm:text-sm font-bold mb-6 sm:mb-8 animate-fadeInUp border border-electric-blue/30">
              <span className="text-gradient-cyber">✨ Next-Generation AI Automation Platform</span>
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold font-inter mb-6 sm:mb-8 animate-slideUp leading-[1.1]">
            <span className="block mb-4 sm:mb-6 text-gradient-animate drop-shadow-2xl">VIDVAS AI</span>
            <span className="block text-gradient-cyber drop-shadow-2xl">Revolution</span>
          </h1>
          <div className="mb-6 sm:mb-8 animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 font-inter italic">
              <span className="text-gradient-cyber font-semibold">विद्वस्</span> (VIDVAS) - Sanskrit for <span className="text-gradient font-semibold">"Intelligence"</span>
            </p>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 sm:mb-12 max-w-5xl mx-auto animate-fadeInUp font-inter font-light leading-relaxed px-6 sm:px-8" style={{ animationDelay: '0.2s' }}>
            Transform your business with <span className="text-gradient font-semibold">intelligent AI agents</span> that work{' '}
            <span className="text-neon-green font-bold">24/7</span> to automate tasks, enhance productivity, and drive{' '}
            <span className="text-gradient-electric font-semibold">unprecedented growth</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 animate-fadeInUp px-4" style={{ animationDelay: '0.4s' }}>
            <Link to="/contact">
              <Button variant="gradient" size="xl" className="w-full sm:w-auto shadow-glow-purple">
                🚀 Get Started Free
              </Button>
            </Link>
            <Link to="/agents">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Explore AI Agents →
              </Button>
            </Link>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
            <div className="text-center animate-fadeInUp glass-premium p-8 rounded-2xl border border-electric-blue/20 hover-glow" style={{ animationDelay: '0.6s' }}>
              <div className="text-5xl font-bold text-gradient-cyber mb-4 font-inter">Coming Soon</div>
              <div className="text-gray-300 text-xl font-inter font-medium">AI Agents Deployed</div>
            </div>
            <div className="text-center animate-fadeInUp glass-premium p-8 rounded-2xl border border-vivid-purple/20 hover-glow" style={{ animationDelay: '0.7s' }}>
              <div className="text-6xl font-bold text-gradient mb-4 font-inter">10x</div>
              <div className="text-gray-300 text-xl font-inter font-medium">Productivity Boost</div>
            </div>
            <div className="text-center animate-fadeInUp glass-premium p-8 rounded-2xl border border-hot-pink/20 hover-glow" style={{ animationDelay: '0.8s' }}>
              <div className="text-6xl font-bold text-gradient-electric mb-4 font-inter">24/7</div>
              <div className="text-gray-300 text-xl font-inter font-medium">Always Active</div>
            </div>
          </div>
        </div>

      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fadeInUp">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold font-inter mb-6">
              Why Choose <span className="text-gradient-animate">Our AI Agents</span>?
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-inter leading-relaxed">
              Our cutting-edge AI agents are designed to seamlessly integrate with your workflow
              and deliver exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="gradient" className="p-10 text-center hover-glow animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-electric-blue to-cyber-cyan rounded-2xl flex items-center justify-center mx-auto mb-8 animate-float shadow-glow-md">
                <span className="text-4xl">🧠</span>
              </div>
              <h3 className="text-3xl font-bold mb-6 font-inter text-gradient-cyber">Autonomous Intelligence</h3>
              <p className="text-gray-300 text-lg font-inter leading-relaxed">
                Our AI agents learn and adapt continuously, making intelligent decisions without human intervention.
              </p>
            </Card>

            <Card variant="gradient" className="p-10 text-center hover-glow animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-vivid-purple to-hot-pink rounded-2xl flex items-center justify-center mx-auto mb-8 animate-float shadow-glow-purple" style={{ animationDelay: '1s' }}>
                <span className="text-4xl">⚡</span>
              </div>
              <h3 className="text-3xl font-bold mb-6 font-inter text-gradient">Lightning Fast</h3>
              <p className="text-gray-300 text-lg font-inter leading-relaxed">
                Process thousands of tasks simultaneously with sub-second response times and 99.9% uptime.
              </p>
            </Card>

            <Card variant="gradient" className="p-10 text-center hover-glow animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-neon-green to-lime-green rounded-2xl flex items-center justify-center mx-auto mb-8 animate-float shadow-[0_0_30px_rgba(0,255,136,0.6)]" style={{ animationDelay: '2s' }}>
                <span className="text-4xl">🔒</span>
              </div>
              <h3 className="text-3xl font-bold mb-6 font-inter text-gradient-electric">Enterprise Security</h3>
              <p className="text-gray-300 text-lg font-inter leading-relaxed">
                Enterprise-grade security with end-to-end encryption and strict compliance with data protection regulations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold font-inter mb-6">
              Frequently Asked <span className="text-gradient-cyber">Questions</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-inter">
              Get answers to common questions about our agentic AI solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card variant="premium" className="p-8 hover-glow">
              <h3 className="text-2xl font-bold mb-4 text-gradient-cyber font-inter">What are AI agents?</h3>
              <p className="text-gray-300 text-lg font-inter leading-relaxed">
                AI agents are autonomous software systems that can perceive their environment, make decisions, and take actions to achieve specific goals without constant human supervision.
              </p>
            </Card>

            <Card variant="premium" className="p-8 hover-glow">
              <h3 className="text-2xl font-bold mb-4 text-gradient font-inter">How quickly can I deploy an agent?</h3>
              <p className="text-gray-300 text-lg font-inter leading-relaxed">
                Most of our pre-built agents can be deployed within 24-48 hours. Custom agents typically take 1-2 weeks depending on complexity and requirements.
              </p>
            </Card>

            <Card variant="premium" className="p-8 hover-glow">
              <h3 className="text-2xl font-bold mb-4 text-gradient-electric font-inter">Is my data secure?</h3>
              <p className="text-gray-300 text-lg font-inter leading-relaxed">
                Yes, we implement enterprise-grade security with end-to-end encryption, secure data processing environments, and strict compliance with data protection regulations.
              </p>
            </Card>

            <Card variant="premium" className="p-8 hover-glow">
              <h3 className="text-2xl font-bold mb-4 text-gradient-cyber font-inter">What industries do you serve?</h3>
              <p className="text-gray-300 text-lg font-inter leading-relaxed">
                We serve various industries including healthcare, finance, e-commerce, manufacturing, and technology. Our agents are customizable for specific industry needs.
              </p>
            </Card>

            <Card variant="premium" className="p-8 hover-glow">
              <h3 className="text-2xl font-bold mb-4 text-gradient font-inter">Do I need technical expertise?</h3>
              <p className="text-gray-300 text-lg font-inter leading-relaxed">
                No technical expertise required. Our platform is designed for business users with intuitive interfaces and comprehensive support from our team.
              </p>
            </Card>

            <Card variant="premium" className="p-8 hover-glow">
              <h3 className="text-2xl font-bold mb-4 text-gradient-electric font-inter">What's the pricing model?</h3>
              <p className="text-gray-300 text-lg font-inter leading-relaxed">
                We offer flexible pricing based on usage, number of agents, and features required. Contact our sales team for a customized quote based on your needs.
              </p>
            </Card>
          </div>

          <div className="text-center mt-16">
            <p className="text-gray-300 text-xl mb-8 font-inter">Have more questions?</p>
            <Link to="/contact">
              <Button variant="gradient-purple" size="lg">
                Contact Our Team →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-electric-blue/10 via-vivid-purple/10 to-hot-pink/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.15),transparent_70%)]" />
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold font-inter mb-8">
            Ready to <span className="text-gradient-animate">Transform</span> Your Business?
          </h2>
          <p className="text-2xl md:text-3xl text-gray-300 mb-12 font-inter">
            Join thousands of companies already leveraging the power of agentic AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/login">
              <Button variant="gradient" size="xl" className="w-full sm:w-auto shadow-glow-purple">
                Get Started Today →
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="gradient-pink" size="xl" className="w-full sm:w-auto">
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


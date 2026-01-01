import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

interface Agent {
  id: number;
  name: string;
  description: string;
  icon: string;
  features: string[];
  category: string;
}

const Agents: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const agents: Agent[] = [
    // Analytics & Data
    {
      id: 1,
      name: 'RAG Pipeline & Chatbot',
      description: 'Advanced retrieval-augmented generation system that combines document search with intelligent conversation capabilities.',
      icon: '🧠',
      features: ['Document Retrieval', 'Context-Aware Responses', 'Multi-format Support', 'Real-time Learning'],
      category: 'Analytics'
    },
    {
      id: 2,
      name: 'Product Videos Generator',
      description: 'AI-powered video creation agent that generates compelling product demonstrations and marketing videos.',
      icon: '🎬',
      features: ['Automated Scripting', 'Visual Effects', 'Brand Integration', 'Multi-platform Export'],
      category: 'Content'
    },
    {
      id: 3,
      name: 'RAG Workflow Agent',
      description: 'Intelligent workflow automation that processes documents and creates structured knowledge bases.',
      icon: '📋',
      features: ['Document Processing', 'Knowledge Extraction', 'Workflow Automation', 'Quality Assurance'],
      category: 'Automation'
    },
    {
      id: 4,
      name: 'Technical Analyst Agent',
      description: 'Advanced technical analysis system for market data, code review, and system diagnostics.',
      icon: '📈',
      features: ['Market Analysis', 'Code Review', 'Performance Metrics', 'Predictive Insights'],
      category: 'Analytics'
    },
    {
      id: 5,
      name: 'First AI Agent',
      description: 'Foundational AI assistant that handles basic automation tasks and serves as an entry point to AI adoption.',
      icon: '🤖',
      features: ['Task Automation', 'Simple Conversations', 'Basic Analytics', 'Easy Integration'],
      category: 'Support'
    },
    {
      id: 6,
      name: 'Supabase Postgres Integration',
      description: 'Database management agent that optimizes Postgres operations and handles data synchronization.',
      icon: '🗄️',
      features: ['Database Optimization', 'Real-time Sync', 'Query Performance', 'Data Backup'],
      category: 'Automation'
    },
    {
      id: 7,
      name: 'Orchestrator Architecture',
      description: 'Master coordination agent that manages multiple AI agents and orchestrates complex workflows.',
      icon: '🎭',
      features: ['Agent Coordination', 'Workflow Management', 'Resource Allocation', 'Performance Monitoring'],
      category: 'Automation'
    },
    {
      id: 8,
      name: 'Prompt Chaining System',
      description: 'Advanced prompt engineering agent that creates sophisticated AI conversation flows.',
      icon: '🔗',
      features: ['Prompt Optimization', 'Chain Management', 'Context Preservation', 'Response Quality'],
      category: 'Content'
    },
    {
      id: 9,
      name: 'Routing Agent',
      description: 'Intelligent request routing system that directs queries to the most appropriate specialized agents.',
      icon: '🚦',
      features: ['Smart Routing', 'Load Balancing', 'Priority Management', 'Fallback Handling'],
      category: 'Support'
    },
    {
      id: 10,
      name: 'Parallelization Engine',
      description: 'High-performance processing agent that executes multiple tasks simultaneously for maximum efficiency.',
      icon: '⚡',
      features: ['Parallel Processing', 'Resource Optimization', 'Speed Enhancement', 'Scalable Architecture'],
      category: 'Automation'
    },
    {
      id: 11,
      name: 'Evaluator Optimizer',
      description: 'Performance assessment agent that continuously monitors and improves AI agent effectiveness.',
      icon: '📊',
      features: ['Performance Metrics', 'Optimization Suggestions', 'Quality Assessment', 'Continuous Learning'],
      category: 'Analytics'
    },
    {
      id: 12,
      name: 'Customer Support Workflow',
      description: 'Comprehensive customer service automation that handles inquiries from initial contact to resolution.',
      icon: '🎧',
      features: ['Ticket Management', 'Multi-channel Support', 'Escalation Protocols', 'Customer Analytics'],
      category: 'Support'
    },
    {
      id: 13,
      name: 'HTM Example Flow',
      description: 'Hierarchical temporal memory system that processes sequential data patterns for predictive analysis.',
      icon: '🧬',
      features: ['Pattern Recognition', 'Temporal Analysis', 'Predictive Modeling', 'Anomaly Detection'],
      category: 'Analytics'
    },
    {
      id: 14,
      name: 'Error Logger',
      description: 'Intelligent error tracking and resolution system that monitors system health and suggests fixes.',
      icon: '🚨',
      features: ['Error Tracking', 'Root Cause Analysis', 'Auto-resolution', 'System Monitoring'],
      category: 'Support'
    },
    {
      id: 15,
      name: 'Dynamic Brain',
      description: 'Adaptive learning system that evolves its capabilities based on usage patterns and feedback.',
      icon: '🧠',
      features: ['Adaptive Learning', 'Pattern Evolution', 'Self-optimization', 'Knowledge Expansion'],
      category: 'Analytics'
    },
    {
      id: 16,
      name: 'Voice Email Agent',
      description: 'Voice-powered email management system that processes audio inputs and manages email communications.',
      icon: '🎤',
      features: ['Voice Recognition', 'Email Automation', 'Audio Processing', 'Smart Responses'],
      category: 'Content'
    },
    {
      id: 17,
      name: 'LinkedIn Workflow',
      description: 'Professional networking automation that manages LinkedIn activities and relationship building.',
      icon: '💼',
      features: ['Connection Management', 'Content Scheduling', 'Lead Generation', 'Engagement Tracking'],
      category: 'Sales'
    },
    {
      id: 18,
      name: 'Invoice Workflow',
      description: 'Automated invoicing system that handles billing, payment tracking, and financial documentation.',
      icon: '💰',
      features: ['Invoice Generation', 'Payment Tracking', 'Tax Calculations', 'Financial Reports'],
      category: 'Automation'
    },
    {
      id: 19,
      name: 'API Integration Hub',
      description: 'Universal API connector that integrates multiple services and manages data flow between systems.',
      icon: '🔌',
      features: ['Multi-API Support', 'Data Transformation', 'Rate Limiting', 'Error Handling'],
      category: 'Automation'
    },
    {
      id: 20,
      name: 'Perplexity Search',
      description: 'Advanced search and research agent that provides comprehensive answers with source verification.',
      icon: '🔍',
      features: ['Deep Research', 'Source Verification', 'Fact Checking', 'Comprehensive Reports'],
      category: 'Analytics'
    },
    {
      id: 21,
      name: 'Firecrawl Extract Template',
      description: 'Web scraping and data extraction agent that intelligently harvests information from websites.',
      icon: '🕷️',
      features: ['Web Scraping', 'Data Extraction', 'Template Matching', 'Content Parsing'],
      category: 'Analytics'
    },
    {
      id: 22,
      name: 'Aply Integration',
      description: 'Application integration platform that connects various software tools and automates workflows.',
      icon: '🔄',
      features: ['App Integration', 'Workflow Automation', 'Data Synchronization', 'Process Optimization'],
      category: 'Automation'
    },
    {
      id: 23,
      name: 'Image Generator',
      description: 'Creative image generation agent powered by advanced AI models for visual content creation.',
      icon: '🎨',
      features: ['Image Generation', 'Style Transfer', 'Custom Prompts', 'High Resolution Output'],
      category: 'Content'
    }
  ];

  const categories = ['All', ...Array.from(new Set(agents.map(agent => agent.category)))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredAgents = agents.filter(agent => {
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-inter mb-8">
            Our AI <span className="text-gradient-animate">Agents</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-inter leading-relaxed">
            Discover our suite of intelligent AI agents, each designed to excel in specific domains and transform your business operations.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gradient-intelligence" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search agents by name, description, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 glass-premium border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyber-aqua focus:border-transparent transition-all duration-200 font-inter text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-3 text-sm text-gray-400 font-inter">
              Found {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </p>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-8 py-3 rounded-full transition-all duration-300 font-sora font-semibold text-base ${selectedCategory === category
                ? 'bg-gradient-to-r from-cyber-aqua to-vivid-purple text-white shadow-glow-md scale-105'
                : 'glass-premium text-gray-300 hover:text-white hover:border-cyber-aqua/50'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} variant="premium" className="p-8 cursor-pointer group hover-glow">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-cyber-aqua via-vivid-purple to-hot-pink rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-glow-purple animate-float">
                  <span className="text-4xl">{agent.icon}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 font-inter text-gradient-intelligence">{agent.name}</h3>
                <span className="text-sm font-semibold text-white px-4 py-2 bg-gradient-to-r from-cyber-aqua/30 to-vivid-purple/30 rounded-full border border-cyber-aqua/40">
                  {agent.category}
                </span>
              </div>

              <p className="text-gray-300 mb-6 text-center font-inter leading-relaxed">
                {agent.description}
              </p>

              <div className="space-y-3 mb-6">
                {agent.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-300">
                    <span className="text-neon-green mr-3 text-lg">✓</span>
                    <span className="font-inter">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                variant="gradient"
                className="w-full"
                onClick={() => setSelectedAgent(agent)}
              >
                Learn More →
              </Button>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card variant="gradient" className="text-center p-12 hover-glow">
          <h2 className="text-4xl md:text-5xl font-bold font-inter mb-6 text-gradient-quantum">
            Ready to Deploy AI Agents?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto font-inter leading-relaxed">
            Start transforming your business today with our intelligent AI agents.
            Choose from our pre-built solutions or let us create custom agents for your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button variant="gradient" size="xl">
              Start Free Trial →
            </Button>
            <Button variant="gradient-purple" size="xl">
              Schedule Demo
            </Button>
          </div>
        </Card>
      </div>

      {/* Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="relative glass-premium border border-white/20 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 md:p-12 shadow-glow-purple animate-scaleIn">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-aqua/5 via-vivid-purple/5 to-hot-pink/5 rounded-3xl animate-pulse-glow pointer-events-none" />

            {/* Close button */}
            <button
              onClick={() => setSelectedAgent(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white text-3xl z-10 transition-all duration-200 hover:scale-110 hover:rotate-90"
            >
              ×
            </button>

            <div className="relative z-10">
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-28 h-28 bg-gradient-to-br from-cyber-aqua via-vivid-purple to-hot-pink rounded-3xl flex items-center justify-center mb-6 shadow-glow-purple animate-float">
                  <span className="text-6xl">{selectedAgent.icon}</span>
                </div>
                <div className="mb-4">
                  <span className="inline-block px-5 py-2 bg-gradient-to-r from-cyber-aqua/30 to-vivid-purple/30 rounded-full border border-cyber-aqua/40 text-white font-semibold text-sm mb-4">
                    {selectedAgent.category}
                  </span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold font-inter mb-4 text-gradient-intelligence">
                  {selectedAgent.name}
                </h3>
              </div>

              {/* Description */}
              <div className="mb-10">
                <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-inter text-center">
                  {selectedAgent.description}
                </p>
              </div>

              {/* Key Features */}
              <div className="mb-10">
                <h4 className="text-2xl md:text-3xl font-bold mb-6 font-inter text-gradient">
                  ✨ Key Features
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedAgent.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start glass-premium p-4 rounded-xl border border-white/5 hover:border-cyber-aqua/30 transition-all duration-300 group"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-neon-green to-lime-green flex items-center justify-center mr-3 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-black text-sm font-bold">✓</span>
                      </div>
                      <span className="text-gray-300 font-inter leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="gradient" size="lg" className="flex-1 shadow-glow-purple">
                  🚀 Deploy Agent
                </Button>
                <Button variant="gradient-purple" size="lg" className="flex-1">
                  📅 Request Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;



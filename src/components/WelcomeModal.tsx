import React, { useState, useEffect } from 'react';
import Button from './Button';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleExplore = () => {
    handleClose();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${isVisible ? 'bg-opacity-80 backdrop-blur-sm' : 'bg-opacity-0'}`}
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className={`relative glass-premium border border-white/20 rounded-3xl max-w-2xl w-full p-8 md:p-12 shadow-glow-purple transform transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-electric-blue via-vivid-purple to-hot-pink rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow-purple animate-float">
            <span className="text-5xl">🚀</span>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-4 text-gradient-animate">
            Welcome to VIDVAS AI
          </h2>

          {/* Sanskrit Meaning */}
          <p className="text-lg md:text-xl text-gray-400 font-jakarta italic mb-6">
            <span className="text-gradient-cyber font-semibold">विद्वस्</span> - Sanskrit for <span className="text-gradient font-semibold">"Intelligence"</span>
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300 mb-8 font-jakarta leading-relaxed">
            Transform your business with <span className="text-gradient font-semibold">intelligent AI agents</span> that work{' '}
            <span className="text-neon-green font-bold">24/7</span> to automate tasks and drive{' '}
            <span className="text-gradient-electric font-semibold">unprecedented growth</span>.
          </p>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 glass-premium rounded-xl border border-electric-blue/20">
              <div className="text-3xl mb-2">⚡</div>
              <p className="text-sm font-jakarta text-gray-300">Lightning-Fast Performance</p>
            </div>
            <div className="p-4 glass-premium rounded-xl border border-vivid-purple/20">
              <div className="text-3xl mb-2">🤖</div>
              <p className="text-sm font-jakarta text-gray-300">Advanced AI Agents</p>
            </div>
            <div className="p-4 glass-premium rounded-xl border border-hot-pink/20">
              <div className="text-3xl mb-2">🔄</div>
              <p className="text-sm font-jakarta text-gray-300">Revolutionary Automation</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="gradient"
              size="lg"
              onClick={handleExplore}
              className="shadow-glow-purple"
            >
              Explore AI Agents 🚀
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleClose}
            >
              Continue to Site
            </Button>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-electric-blue rounded-full animate-float opacity-60" />
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-hot-pink rounded-full animate-float opacity-60" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-20 w-2 h-2 bg-vivid-purple rounded-full animate-float opacity-60" style={{ animationDelay: '0.5s' }} />
      </div>
    </div>
  );
};

export default WelcomeModal;
